import { UserSyncService } from "./lib/services/user-sync";
import { prisma } from "./lib/prisma";

async function runTest() {
  const testClerkId = "user_test_12345";
  const testEmail = "test_webhook_user@ourstory.local";

  console.log("--------------------------------------------------");
  console.log("🚀 Starting Clerk Webhook Sync Database Test...");
  console.log("--------------------------------------------------");

  try {
    // Clean up any left-over test user first
    await prisma.user.deleteMany({ where: { clerkId: testClerkId } });

    // Step 1: Test User Creation (Idempotent)
    console.log("\n[Step 1] Testing User Creation...");
    const createdUser = await UserSyncService.createUser({
      clerkId: testClerkId,
      email: testEmail,
      firstName: "Test",
      lastName: "WebhookUser",
      imageUrl: "https://img.clerk.com/test_webhook_user",
    });

    console.log("✅ User created successfully in database!");
    console.log("Database Record:", {
      id: createdUser.id,
      clerkId: createdUser.clerkId,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      imageUrl: createdUser.imageUrl,
      name: createdUser.name,
      avatarUrl: createdUser.avatarUrl,
    });

    // Verification 1
    if (createdUser.name !== "Test WebhookUser" || createdUser.avatarUrl !== "https://img.clerk.com/test_webhook_user") {
      throw new Error("Created user fields do not match expected values or compatibility fields.");
    }

    // Step 2: Test User Update
    console.log("\n[Step 2] Testing User Update...");
    const updatedUser = await UserSyncService.updateUser(testClerkId, {
      firstName: "TestUpdated",
      lastName: "WebhookUserUpdated",
      imageUrl: "https://img.clerk.com/test_webhook_user_updated",
    });

    console.log("✅ User updated successfully in database!");
    console.log("Updated Record:", {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      imageUrl: updatedUser.imageUrl,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
    });

    // Verification 2
    if (
      updatedUser.name !== "TestUpdated WebhookUserUpdated" ||
      updatedUser.avatarUrl !== "https://img.clerk.com/test_webhook_user_updated"
    ) {
      throw new Error("Updated user fields do not match expected values.");
    }

    // Step 3: Test Idempotent Deletion
    console.log("\n[Step 3] Testing User Deletion...");
    const deletedUser = await UserSyncService.deleteUser(testClerkId);
    console.log("✅ User deleted successfully from database!");

    // Verification 3: Verify user is no longer in db
    const lookup = await prisma.user.findUnique({ where: { clerkId: testClerkId } });
    if (lookup) {
      throw new Error("User was not deleted successfully. Record still exists in database.");
    }
    console.log("✅ Verified: User record no longer exists in database.");

    // Step 4: Test double-delete safety (idempotence)
    console.log("\n[Step 4] Testing Deletion Idempotence (Double Delete)...");
    const secondDelete = await UserSyncService.deleteUser(testClerkId);
    console.log("✅ Double delete executed safely (returned: " + secondDelete + ")");

    console.log("\n--------------------------------------------------");
    console.log("🎉 All tests passed successfully! Webhook Sync works!");
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n❌ Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
