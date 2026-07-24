import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ success: true, timeCapsules: [] });
    }

    const timeCapsules = await prisma.timeCapsule.findMany({
      where: { coupleId: dbUser.coupleId },
      orderBy: { unlockDate: "asc" },
    });

    return NextResponse.json({ success: true, timeCapsules });
  } catch (error: any) {
    console.error("[GET /api/time-capsules] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch time capsules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { message, unlockDate, sealedBy } = body;

    if (!message || !unlockDate) {
      return NextResponse.json({ error: "Message and unlockDate are required" }, { status: 400 });
    }

    const capsule = await prisma.timeCapsule.create({
      data: {
        coupleId: dbUser.coupleId,
        message,
        unlockDate: new Date(unlockDate),
        sealedBy: sealedBy || "A",
      },
    });

    return NextResponse.json({ success: true, capsule });
  } catch (error: any) {
    console.error("[POST /api/time-capsules] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create time capsule" }, { status: 500 });
  }
}
