import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { journalEntryId, author, content } = body;

    if (!journalEntryId || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await prisma.journalComment.create({
      data: {
        journalEntryId,
        author,
        content,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    console.error("[POST /api/journal/comments] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create comment" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { commentId, content } = body;

    if (!commentId || !content) {
      return NextResponse.json({ error: "Missing commentId or content" }, { status: 400 });
    }

    const updated = await prisma.journalComment.update({
      where: { id: commentId },
      data: { content },
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error: any) {
    console.error("[PATCH /api/journal/comments] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    await prisma.journalComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/journal/comments] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete comment" }, { status: 500 });
  }
}
