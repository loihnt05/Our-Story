import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({
        success: true,
        quizPacks: [],
        quizMemories: [],
        weeklyQuests: [],
        wheelCategories: [],
        decisionHistory: [],
      });
    }

    let [
      quizPacks,
      quizMemories,
      weeklyQuests,
      wheelCategories,
      decisionHistory,
    ] = await Promise.all([
      prisma.customQuizPack.findMany({ where: { coupleId: dbUser.coupleId }, orderBy: { createdAt: "desc" } }),
      prisma.quizMemory.findMany({ where: { coupleId: dbUser.coupleId }, orderBy: { date: "desc" } }),
      prisma.weeklyQuest.findMany({ where: { coupleId: dbUser.coupleId }, orderBy: { createdAt: "asc" } }),
      prisma.wheelCategory.findMany({ where: { coupleId: dbUser.coupleId } }),
      prisma.decisionHistory.findMany({ where: { coupleId: dbUser.coupleId }, orderBy: { date: "desc" } }),
    ]);

    if (quizPacks.length === 0) {
      const defaultPack = await prisma.customQuizPack.create({
        data: {
          coupleId: dbUser.coupleId,
          name: "Daily Relationship Chemistry Quiz 💖",
          description: "Daily test to check your relationship chemistry, favorite habits, and spontaneous moments!",
          coverEmoji: "💖",
          questions: [
            {
              id: "dq1",
              question: "What is my absolute favorite way to spend a rainy Sunday afternoon? 🌧️",
              options: [
                "Sipping hot coffee & reading a novel ☕",
                "Playing video games under cozy blankets 🎮",
                "Binge-watching romantic movies 🍿",
                "Taking a long cozy nap 💤"
              ],
              correctAnswer: 0
            },
            {
              id: "dq2",
              question: "Where is my dream vacation destination that we haven't visited yet? ✈️",
              options: [
                "Kyoto, Japan during cherry blossom season 🇯🇵",
                "Amalfi Coast, Italy in summer 🇮🇹",
                "Glass igloo stargazing in Finland 🌌",
                "Overwater villa in Bora Bora 🌊"
              ],
              correctAnswer: 2
            },
            {
              id: "dq3",
              question: "What is my favorite late-night snack when we stay up late together? 🍕",
              options: [
                "Hot pizza & sodas 🍕",
                "Artisanal gelato 🍦",
                "Freshly baked chocolate cookies 🍪",
                "Crunchy nachos & cheese dip 🧀"
              ],
              correctAnswer: 1
            }
          ]
        }
      });
      quizPacks = [defaultPack];
    }

    return NextResponse.json({
      success: true,
      quizPacks,
      quizMemories,
      weeklyQuests,
      wheelCategories,
      decisionHistory,
      coupleStats: {
        memoryGuessScoreA: dbUser.couple?.memoryGuessScoreA ?? 0,
        memoryGuessScoreB: dbUser.couple?.memoryGuessScoreB ?? 0,
        memoryGuessStreak: dbUser.couple?.memoryGuessStreak ?? 0,
        intimacyScore: dbUser.couple?.intimacyScore ?? 75,
        understandingScore: dbUser.couple?.understandingScore ?? 82,
      },
    });
  } catch (error: any) {
    console.error("[GET /api/games] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch games data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No couple associated with user" }, { status: 400 });
    }

    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case "SAVE_QUIZ_RESULT": {
        const { title, scoreA, scoreB, intimacyScore, understandingScore } = payload;
        const memory = await prisma.quizMemory.create({
          data: {
            coupleId: dbUser.coupleId,
            title: title || "Couple Quiz",
            scoreA: scoreA || 0,
            scoreB: scoreB || 0,
            intimacyScore: intimacyScore || 80,
            understandingScore: understandingScore || 85,
          },
        });

        // Update stats on Couple
        await prisma.couple.update({
          where: { id: dbUser.coupleId },
          data: {
            ...(intimacyScore !== undefined && { intimacyScore }),
            ...(understandingScore !== undefined && { understandingScore }),
          },
        });

        return NextResponse.json({ success: true, memory });
      }

      case "CREATE_QUIZ_PACK": {
        const { name, description, coverEmoji, questions } = payload;
        const pack = await prisma.customQuizPack.create({
          data: {
            coupleId: dbUser.coupleId,
            name,
            description,
            coverEmoji: coverEmoji || "💖",
            questions: questions || [],
          },
        });

        return NextResponse.json({ success: true, pack });
      }

      case "DELETE_QUIZ_PACK": {
        const { packId } = payload;
        await prisma.customQuizPack.deleteMany({
          where: { id: packId, coupleId: dbUser.coupleId },
        });
        return NextResponse.json({ success: true });
      }

      case "UPDATE_MEMORY_GUESS_SCORES": {
        const { scoreA, scoreB, streak } = payload;
        const updated = await prisma.couple.update({
          where: { id: dbUser.coupleId },
          data: {
            ...(scoreA !== undefined && { memoryGuessScoreA: scoreA }),
            ...(scoreB !== undefined && { memoryGuessScoreB: scoreB }),
            ...(streak !== undefined && { memoryGuessStreak: streak }),
          },
        });

        return NextResponse.json({ success: true, stats: updated });
      }

      case "TOGGLE_WEEKLY_QUEST": {
        const { questId, completed } = payload;
        const quest = await prisma.weeklyQuest.update({
          where: { id: questId },
          data: { completed },
        });

        return NextResponse.json({ success: true, quest });
      }

      case "CREATE_WHEEL_CATEGORY": {
        const { name, icon, items } = payload;
        const category = await prisma.wheelCategory.create({
          data: {
            coupleId: dbUser.coupleId,
            name,
            icon: icon || "🎡",
            isCustom: true,
            items: items || [],
          },
        });

        return NextResponse.json({ success: true, category });
      }

      case "UPDATE_WHEEL_CATEGORY": {
        const { categoryId, items, name, icon } = payload;
        const category = await prisma.wheelCategory.updateMany({
          where: { id: categoryId, coupleId: dbUser.coupleId },
          data: {
            ...(items !== undefined && { items }),
            ...(name !== undefined && { name }),
            ...(icon !== undefined && { icon }),
          },
        });

        return NextResponse.json({ success: true, category });
      }

      case "DELETE_WHEEL_CATEGORY": {
        const { categoryId } = payload;
        await prisma.wheelCategory.deleteMany({
          where: { id: categoryId, coupleId: dbUser.coupleId },
        });

        return NextResponse.json({ success: true });
      }

      case "RECORD_DECISION": {
        const { text, emoji, categoryName } = payload;
        const decision = await prisma.decisionHistory.create({
          data: {
            coupleId: dbUser.coupleId,
            text,
            emoji: emoji || "🎯",
            categoryName: categoryName || "Decision Wheel",
          },
        });

        return NextResponse.json({ success: true, decision });
      }

      case "TOGGLE_DECISION_COMPLETED": {
        const { decisionId, completed } = payload;
        await prisma.decisionHistory.updateMany({
          where: { id: decisionId, coupleId: dbUser.coupleId },
          data: { completed },
        });

        return NextResponse.json({ success: true });
      }

      case "DELETE_DECISION_HISTORY": {
        await prisma.decisionHistory.deleteMany({
          where: { coupleId: dbUser.coupleId },
        });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[POST /api/games] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process game action" }, { status: 500 });
  }
}

