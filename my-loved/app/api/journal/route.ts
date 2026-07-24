import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ success: true, journalEntries: [] });
    }

    const journalEntries = await prisma.journalEntry.findMany({
      where: { coupleId: dbUser.coupleId },
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
        reactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, journalEntries });
  } catch (error: any) {
    console.error("[GET /api/journal] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch journal entries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { author, date, emotion, content } = body;

    if (!author || !date || !emotion || !content) {
      return NextResponse.json({ error: "Author, date, emotion, and content are required" }, { status: 400 });
    }

    // Upsert journal entry for this couple, author, date
    const entry = await prisma.journalEntry.upsert({
      where: {
        coupleId_author_date: {
          coupleId: dbUser.coupleId,
          author,
          date,
        },
      },
      update: {
        emotion,
        content,
      },
      create: {
        coupleId: dbUser.coupleId,
        author,
        date,
        emotion,
        content,
      },
      include: {
        comments: true,
        reactions: true,
      },
    });

    // Automatically recalculate streak count for couple
    const allEntries = await prisma.journalEntry.findMany({
      where: { coupleId: dbUser.coupleId },
      select: { date: true },
    });

    const uniqueDates = Array.from(new Set(allEntries.map((e) => e.date))).sort();
    let currentStreak = 0;
    const todayStr = new Date().toISOString().split("T")[0];

    // Compute consecutive days streak ending today or yesterday
    if (uniqueDates.length > 0) {
      const datesSet = new Set(uniqueDates);
      let checkDate = new Date();
      
      // If no entry today, start checking from yesterday
      if (!datesSet.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const yyyymmdd = checkDate.toISOString().split("T")[0];
        if (datesSet.has(yyyymmdd)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    await prisma.couple.update({
      where: { id: dbUser.coupleId },
      data: {
        streakCount: Math.max(currentStreak, 1),
        lastActiveStreak: Math.max(currentStreak, 1),
      },
    });

    return NextResponse.json({ success: true, entry, streakCount: Math.max(currentStreak, 1) });
  } catch (error: any) {
    console.error("[POST /api/journal] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save journal entry" }, { status: 500 });
  }
}
