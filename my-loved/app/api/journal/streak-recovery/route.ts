import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId || !dbUser.couple) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { targetDate, author } = body; // targetDate e.g. "YYYY-MM-DD"

    if (!targetDate) {
      return NextResponse.json({ error: "targetDate is required" }, { status: 400 });
    }

    const couple = dbUser.couple;

    // Check if recovery limits reached
    if (couple.recoveriesUsed >= 3) {
      return NextResponse.json({ error: "Maximum 3 streak recoveries reached" }, { status: 400 });
    }

    if (couple.recoveredDates.includes(targetDate)) {
      return NextResponse.json({ error: "Date already recovered" }, { status: 400 });
    }

    // Auto-create a recovery journal entry for that date
    await prisma.journalEntry.upsert({
      where: {
        coupleId_author_date: {
          coupleId: couple.id,
          author: author || "A",
          date: targetDate,
        },
      },
      update: {
        emotion: "🔥",
        content: `[Streak Recovered ✨] Restored relationship journal entry for ${targetDate}.`,
      },
      create: {
        coupleId: couple.id,
        author: author || "A",
        date: targetDate,
        emotion: "🔥",
        content: `[Streak Recovered ✨] Restored relationship journal entry for ${targetDate}.`,
      },
    });

    const updatedCouple = await prisma.couple.update({
      where: { id: couple.id },
      data: {
        recoveriesUsed: couple.recoveriesUsed + 1,
        recoveredDates: [...couple.recoveredDates, targetDate],
        streakCount: couple.streakCount + 1,
      },
    });

    return NextResponse.json({
      success: true,
      streakCount: updatedCouple.streakCount,
      recoveriesUsed: updatedCouple.recoveriesUsed,
      recoveredDates: updatedCouple.recoveredDates,
    });
  } catch (error: any) {
    console.error("[POST /api/journal/streak-recovery] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to recover streak" }, { status: 500 });
  }
}
