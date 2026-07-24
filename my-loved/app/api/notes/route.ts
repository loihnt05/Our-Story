import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ success: true, notes: [] });
    }

    const notes = await prisma.note.findMany({
      where: { coupleId: dbUser.coupleId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error("[GET /api/notes] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch romantic notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { text, author, color } = body;

    if (!text) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        coupleId: dbUser.coupleId,
        text,
        author: author || dbUser.firstName || "Anonymous",
        color: color || "rose",
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error("[POST /api/notes] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create note" }, { status: 500 });
  }
}
