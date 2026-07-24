import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ success: true, milestones: [] });
    }

    const milestones = await prisma.milestone.findMany({
      where: { coupleId: dbUser.coupleId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, milestones });
  } catch (error: any) {
    console.error("[GET /api/milestones] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch milestones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { title, date, description, icon, image } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        coupleId: dbUser.coupleId,
        title,
        date: new Date(date),
        description: description || "",
        icon: icon || "💖",
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, milestone });
  } catch (error: any) {
    console.error("[POST /api/milestones] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create milestone" }, { status: 500 });
  }
}
