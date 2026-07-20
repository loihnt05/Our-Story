import { prisma } from "../prisma";

export interface SyncUserPayload {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export class UserSyncService {
  /**
   * Synchronizes user creation. Ensures idempotency.
   * Uses upsert to gracefully handle cases where a creation webhook is processed multiple times.
   */
  static async createUser(payload: SyncUserPayload) {
    const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
    
    console.log(`[UserSyncService] Creating/Syncing user: ${payload.clerkId} (${payload.email})`);
    
    return await prisma.user.upsert({
      where: { clerkId: payload.clerkId },
      update: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        imageUrl: payload.imageUrl,
        name: fullName || null,
        avatarUrl: payload.imageUrl,
      },
      create: {
        clerkId: payload.clerkId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        imageUrl: payload.imageUrl,
        name: fullName || null,
        avatarUrl: payload.imageUrl,
      },
    });
  }

  /**
   * Updates an existing user mapped by clerkId.
   */
  static async updateUser(clerkId: string, payload: Partial<Omit<SyncUserPayload, "clerkId">>) {
    console.log(`[UserSyncService] Updating user: ${clerkId}`);

    // Fetch existing user to determine how to combine names if partial details are sent
    const existing = await prisma.user.findUnique({ where: { clerkId } });
    if (!existing) {
      throw new Error(`User with clerkId ${clerkId} not found in database for update.`);
    }

    const updatedFirstName = payload.firstName !== undefined ? payload.firstName : existing.firstName;
    const updatedLastName = payload.lastName !== undefined ? payload.lastName : existing.lastName;
    const fullName = [updatedFirstName, updatedLastName].filter(Boolean).join(" ");

    return await prisma.user.update({
      where: { clerkId },
      data: {
        ...(payload.email && { email: payload.email }),
        ...(payload.firstName !== undefined && { firstName: payload.firstName }),
        ...(payload.lastName !== undefined && { lastName: payload.lastName }),
        ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
        name: fullName || null,
        ...(payload.imageUrl !== undefined && { avatarUrl: payload.imageUrl }),
      },
    });
  }

  /**
   * Deletes a user by Clerk ID. Safe to call multiple times.
   */
  static async deleteUser(clerkId: string) {
    console.log(`[UserSyncService] Deleting user: ${clerkId}`);
    
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.log(`[UserSyncService] Delete request ignored: User with clerkId ${clerkId} not found.`);
      return null;
    }

    return await prisma.user.delete({
      where: { clerkId },
    });
  }
}
