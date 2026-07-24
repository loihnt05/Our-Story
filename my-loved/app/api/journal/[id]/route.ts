import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await getCurrentDbUser();
    const { id } = await params;

    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.journalEntry.deleteMany({
      where: {
        id,
        coupleId: dbUser.coupleId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/journal/[id]] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete journal entry" }, { status: 500 });
  }
}
