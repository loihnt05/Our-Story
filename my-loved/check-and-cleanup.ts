import { prisma } from "./lib/prisma";

async function cleanupTailoi() {
  console.log("==================================================");
  console.log("🔍 Checking Users and Couples in Neon Database...");
  console.log("==================================================");

  try {
    const allUsers = await prisma.user.findMany({
      include: { couple: true },
    });

    console.log(`Found ${allUsers.length} total users in DB:`);
    allUsers.forEach((u) => {
      console.log(`- User: ${u.name} | ClerkID: ${u.clerkId} | Email: ${u.email} | CoupleID: ${u.coupleId}`);
    });

    // Search for any user or couple with name/email matching 'tailoi' or similar
    const tailoiUsers = allUsers.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes("tailoi")) ||
        (u.email && u.email.toLowerCase().includes("tailoi")) ||
        (u.firstName && u.firstName.toLowerCase().includes("tailoi"))
    );

    if (tailoiUsers.length > 0) {
      console.log(`\nFound ${tailoiUsers.length} matching 'tailoi' user(s). Removing them...`);
      for (const tu of tailoiUsers) {
        await prisma.user.delete({ where: { id: tu.id } });
        console.log(`✅ Deleted user: ${tu.name} (${tu.email})`);
      }
    } else {
      console.log("\nNo 'tailoi' user found directly in User table.");
    }

    // Ensure Juliet is coupled ONLY with Romeo (mock_user_id)
    const romeo = await prisma.user.findUnique({ where: { clerkId: "mock_user_id" } });
    const juliet = await prisma.user.findUnique({ where: { clerkId: "user_juliet_456" } });

    if (romeo && juliet && romeo.coupleId) {
      // Ensure Juliet has the exact same coupleId as Romeo
      if (juliet.coupleId !== romeo.coupleId) {
        await prisma.user.update({
          where: { id: juliet.id },
          data: { coupleId: romeo.coupleId, role: "B" },
        });
        console.log(`✅ Linked Juliet exclusively to Romeo's couple (${romeo.coupleId}).`);
      }
    }

    console.log("==================================================");
    console.log("🎉 Cleanup Complete!");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Cleanup error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTailoi();
