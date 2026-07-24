import { currentUser } from "@clerk/nextjs/server";
import { UserSyncService } from "@/lib/services/user-sync";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress || user.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      return NextResponse.json({ error: "User must have an email address" }, { status: 400 });
    }

    const dbUser = await UserSyncService.createUser({
      clerkId: user.id,
      email: primaryEmail,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      imageUrl: user.imageUrl ?? null,
    });

    console.log(`[sync-user] Synced user ${user.id} (${primaryEmail}) to Neon DB.`);
    return NextResponse.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error("[sync-user] Error syncing user to Neon DB:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
