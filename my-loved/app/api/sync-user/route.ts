import { currentUser } from "@clerk/nextjs/server";
import { UserSyncService } from "@/lib/services/user-sync";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body
    }

    let user: any = null;
    try {
      user = await currentUser();
    } catch {
      // Clerk currentUser not available or mock mode
    }

    // 1. If real Clerk user is present
    if (user) {
      const primaryEmail = user.emailAddresses.find(
        (email: any) => email.id === user.primaryEmailAddressId
      )?.emailAddress || user.emailAddresses[0]?.emailAddress;

      if (primaryEmail) {
        const dbUser = await UserSyncService.createUser({
          clerkId: user.id,
          email: primaryEmail,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          imageUrl: user.imageUrl ?? null,
        });

        return NextResponse.json({ success: true, user: dbUser });
      }
    }

    // 2. Fallback / Mock Auth user sync (Romeo or Juliet)
    const clerkId = body.clerkId || "mock_user_id";
    const isJuliet = clerkId === "user_juliet_456" || body.email === "juliet@verona.it";

    const targetClerkId = isJuliet ? "user_juliet_456" : "mock_user_id";
    const targetEmail = isJuliet ? "juliet@verona.it" : "romeo@verona.it";
    const targetFirstName = isJuliet ? "Juliet" : "Romeo";
    const targetLastName = isJuliet ? "Capulet" : "Montague";
    const targetAvatar = isJuliet
      ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

    const dbUser = await UserSyncService.createUser({
      clerkId: targetClerkId,
      email: targetEmail,
      firstName: targetFirstName,
      lastName: targetLastName,
      imageUrl: targetAvatar,
    });

    console.log(`[sync-user] Synced ${targetFirstName} (${targetClerkId}) to Neon DB.`);
    return NextResponse.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error("[sync-user] Error syncing user to Neon DB:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
