import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Retrieves the currently authenticated user from the database and ensures a Couple record is attached.
 */
export async function getCurrentDbUser() {
  let userId: string | null = null;
  
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (err) {
    console.warn("[getCurrentDbUser] Clerk auth() failed or not available:", err);
  }

  // Fallback for Mock Auth or local dev if Clerk userId is not present
  if (!userId) {
    userId = "mock_user_id";
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      couple: true,
    },
  });

  // If database record doesn't exist yet, auto-create it
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: userId === "mock_user_id" ? "romeo@verona.it" : `${userId}@auth.local`,
        firstName: userId === "mock_user_id" ? "Romeo" : "Partner",
        lastName: userId === "mock_user_id" ? "Montague" : "",
        name: userId === "mock_user_id" ? "Romeo Montague" : "Partner",
      },
      include: {
        couple: true,
      },
    });
  }

  // Ensure user is attached to a Couple
  if (!dbUser.coupleId || !dbUser.couple) {
    // Check if there is an existing couple we can join or create a new one
    let couple = await prisma.couple.findFirst();
    if (!couple) {
      couple = await prisma.couple.create({
        data: {
          personAName: dbUser.firstName || "Romeo",
          personBName: "Juliet",
          personADesc: "My Universe 🌌",
          personBDesc: "My Anchor ⚓",
          anniversaryDate: new Date("2025-01-01"),
          customTitle: "Our Love Story",
          themeId: "rose-gold",
        },
      });
    }

    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { coupleId: couple.id },
      include: { couple: true },
    });
  }

  return dbUser;
}
