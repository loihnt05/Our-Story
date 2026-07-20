import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Retrieves the currently authenticated user from the database.
 * 
 * - Leverages Clerk's lightweight auth() utility to fetch the current session's userId.
 * - Searches the local Prisma database using the clerkId.
 * - Throws an error if the user is unauthenticated or if the database sync has not occurred yet.
 */
export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: User is not authenticated.");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      couple: true, // Keep couple information loaded for dashboard conveniences
    },
  });

  if (!dbUser) {
    throw new Error(
      `Synchronization Error: User is authenticated in Clerk (${userId}), but no corresponding local database record was found. Webhook synchronization may be pending.`
    );
  }

  return dbUser;
}
