import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    return NextResponse.json({ success: true, couple: dbUser.couple });
  } catch (error: any) {
    console.error("[GET /api/couple] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch couple details" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const {
      personAName,
      personBName,
      personADesc,
      personBDesc,
      personAAvatar,
      personBAvatar,
      anniversaryDate,
      customTitle,
      themeId,
      secretNote,
      streakCount,
      lastActiveStreak,
      recoveriesUsed,
      recoveredDates,
    } = body;

    const updatedCouple = await prisma.couple.update({
      where: { id: dbUser.coupleId },
      data: {
        ...(personAName !== undefined && { personAName }),
        ...(personBName !== undefined && { personBName }),
        ...(personADesc !== undefined && { personADesc }),
        ...(personBDesc !== undefined && { personBDesc }),
        ...(personAAvatar !== undefined && { personAAvatar }),
        ...(personBAvatar !== undefined && { personBAvatar }),
        ...(anniversaryDate !== undefined && { anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null }),
        ...(customTitle !== undefined && { customTitle }),
        ...(themeId !== undefined && { themeId }),
        ...(secretNote !== undefined && { secretNote }),
        ...(streakCount !== undefined && { streakCount }),
        ...(lastActiveStreak !== undefined && { lastActiveStreak }),
        ...(recoveriesUsed !== undefined && { recoveriesUsed }),
        ...(recoveredDates !== undefined && { recoveredDates }),
      },
    });

    return NextResponse.json({ success: true, couple: updatedCouple });
  } catch (error: any) {
    console.error("[PATCH /api/couple] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update couple details" }, { status: 500 });
  }
}
