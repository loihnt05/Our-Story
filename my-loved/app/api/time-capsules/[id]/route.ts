import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await getCurrentDbUser();
    const { id } = await params;

    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const capsule = await prisma.timeCapsule.findFirst({
      where: { id, coupleId: dbUser.coupleId },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (new Date() < new Date(capsule.unlockDate)) {
      return NextResponse.json({ error: "Capsule cannot be unlocked before unlock date" }, { status: 400 });
    }

    const updated = await prisma.timeCapsule.update({
      where: { id },
      data: { isUnlocked: true },
    });

    return NextResponse.json({ success: true, capsule: updated });
  } catch (error: any) {
    console.error("[PATCH /api/time-capsules/[id]] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to unlock time capsule" }, { status: 500 });
  }
}
