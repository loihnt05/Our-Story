import { prisma } from "./lib/prisma";

async function seedMoreData() {
  console.log("==================================================");
  console.log("🌸 Seeding Extra Rich Data for Romeo & Juliet...");
  console.log("==================================================");

  try {
    // 1. Find or Create Couple
    let couple = await prisma.couple.findFirst();

    if (!couple) {
      couple = await prisma.couple.create({
        data: {
          personAName: "Romeo",
          personBName: "Juliet",
          personADesc: "My Universe 🌌",
          personBDesc: "My Anchor ⚓",
          personAAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
          personBAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
          anniversaryDate: new Date("2025-01-01T00:00:00.000Z"),
          customTitle: "Romeo & Juliet's Eternal Journey 💕",
          themeId: "rose-gold",
          secretNote: "My dearest Juliet, every single day with you feels like a beautiful dream. Yours forever and always. ❤️",
          streakCount: 14,
          lastActiveStreak: 14,
          recoveriesUsed: 1,
          recoveredDates: ["2026-07-01", "2026-07-10"],
          memoryGuessScoreA: 280,
          memoryGuessScoreB: 310,
          memoryGuessStreak: 12,
          intimacyScore: 94,
          understandingScore: 96,
          completedWeeks: 6,
        },
      });
    } else {
      couple = await prisma.couple.update({
        where: { id: couple.id },
        data: {
          streakCount: 14,
          lastActiveStreak: 14,
          intimacyScore: 94,
          understandingScore: 96,
          completedWeeks: 6,
        },
      });
    }

    const coupleId = couple.id;
    console.log(`✅ Couple ID: ${coupleId}`);

    // 2. Ensure Users
    await prisma.user.upsert({
      where: { clerkId: "mock_user_id" },
      update: { coupleId },
      create: {
        clerkId: "mock_user_id",
        email: "romeo@verona.it",
        firstName: "Romeo",
        lastName: "Montague",
        name: "Romeo Montague",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        role: "A",
        coupleId,
      },
    });

    await prisma.user.upsert({
      where: { clerkId: "user_juliet_456" },
      update: { coupleId },
      create: {
        clerkId: "user_juliet_456",
        email: "juliet@verona.it",
        firstName: "Juliet",
        lastName: "Capulet",
        name: "Juliet Capulet",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
        role: "B",
        coupleId,
      },
    });

    // 3. Clear existing sub-records for clean fresh re-seed
    await prisma.milestone.deleteMany({ where: { coupleId } });
    await prisma.note.deleteMany({ where: { coupleId } });
    await prisma.journalEntry.deleteMany({ where: { coupleId } });
    await prisma.timeCapsule.deleteMany({ where: { coupleId } });
    await prisma.customQuizPack.deleteMany({ where: { coupleId } });
    await prisma.quizMemory.deleteMany({ where: { coupleId } });
    await prisma.weeklyQuest.deleteMany({ where: { coupleId } });
    await prisma.wheelCategory.deleteMany({ where: { coupleId } });
    await prisma.decisionHistory.deleteMany({ where: { coupleId } });

    // 4. Seed 8 Detailed Milestones
    console.log("\n[1/6] Seeding 8 Milestones...");
    await prisma.milestone.createMany({
      data: [
        {
          coupleId,
          title: "First Met in Verona 🌸",
          date: new Date("2024-11-15T00:00:00.000Z"),
          description: "The magical evening when our eyes met across the room at the autumn gala.",
          icon: "✨",
        },
        {
          coupleId,
          title: "First Espresso Date ☕",
          date: new Date("2024-12-05T00:00:00.000Z"),
          description: "We sat by the river, drinking cappuccino and talking until the cafe closed.",
          icon: "☕",
        },
        {
          coupleId,
          title: "Officially Together 💕",
          date: new Date("2025-01-01T00:00:00.000Z"),
          description: "Under the New Year fireworks, we promised to walk through life together.",
          icon: "💖",
        },
        {
          coupleId,
          title: "First Trip to Florence 🍕",
          date: new Date("2025-04-12T00:00:00.000Z"),
          description: "Exploring ancient cobblestone streets, gelato by Ponte Vecchio.",
          icon: "🍕",
        },
        {
          coupleId,
          title: "Adopted Our Puppy 'Luna' 🐶",
          date: new Date("2025-08-20T00:00:00.000Z"),
          description: "Welcomed our little golden fur ball into our loving home!",
          icon: "🐶",
        },
        {
          coupleId,
          title: "Moved into Our Apartment 🏡",
          date: new Date("2025-10-01T00:00:00.000Z"),
          description: "Building furniture together, painting walls, and making our cozy nest.",
          icon: "🏡",
        },
        {
          coupleId,
          title: "1st Year Anniversary Sunset 🌅",
          date: new Date("2026-01-01T00:00:00.000Z"),
          description: "Celebrated 365 days of unconditional love with a candlelight dinner.",
          icon: "🥂",
        },
        {
          coupleId,
          title: "Summer Beach Getaway 🏖️",
          date: new Date("2026-06-15T00:00:00.000Z"),
          description: "Sunbathing, ocean waves, and watching stars on the beach all night.",
          icon: "🌊",
        },
      ],
    });

    // 5. Seed 8 Romantic Notes
    console.log("\n[2/6] Seeding 8 Romantic Notes...");
    await prisma.note.createMany({
      data: [
        {
          coupleId,
          text: "You make my heart smile in ways nobody else ever could! 💖",
          author: "Romeo",
          color: "rose",
          date: new Date("2026-07-20T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Thank you for making my coffee every morning. Small acts of love mean everything.",
          author: "Juliet",
          color: "purple",
          date: new Date("2026-07-21T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Forever is a long time, but I wouldn't mind spending every second with you. 🌌",
          author: "Romeo",
          color: "blue",
          date: new Date("2026-07-22T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Don't forget: date night this Friday at 7 PM! 🍝",
          author: "Juliet",
          color: "amber",
          date: new Date("2026-07-23T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Your laugh is my absolute favorite sound in the world. 🎶",
          author: "Romeo",
          color: "emerald",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "I love the way you hold my hand when we cross the street. 🥰",
          author: "Juliet",
          color: "rose",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Packing for our weekend trip! Can't wait to explore together! 🧳",
          author: "Romeo",
          color: "indigo",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "You're my home, no matter where we are. ❤️",
          author: "Juliet",
          color: "purple",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
      ],
    });

    // 6. Seed 5 Daily Feelings Journal Entries with Conversations & Emoji Reactions
    console.log("\n[3/6] Seeding Daily Feelings Journal Entries...");
    const dates = ["2026-07-20", "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24"];

    for (const d of dates) {
      await prisma.journalEntry.create({
        data: {
          coupleId,
          author: "A",
          date: d,
          emotion: d === "2026-07-24" ? "Overjoyed ✨" : "Loved 💖",
          content: `Romeo's log for ${d}: Shared wonderful moments today! Always grateful for your presence in my life.`,
          comments: {
            create: [
              {
                author: "B",
                content: `Juliet: Couldn't agree more, Romeo! Love you endlessly. ❤️ (${d})`,
              },
            ],
          },
          reactions: {
            create: [{ author: "B", emoji: "❤️" }],
          },
        },
      });

      await prisma.journalEntry.create({
        data: {
          coupleId,
          author: "B",
          date: d,
          emotion: d === "2026-07-24" ? "Peaceful 🌿" : "Happy 😊",
          content: `Juliet's log for ${d}: Had a productive day, and ending it next to you makes everything complete.`,
          comments: {
            create: [
              {
                author: "A",
                content: `Romeo: You are my daily blessing! Always by your side. 🥰 (${d})`,
              },
            ],
          },
          reactions: {
            create: [{ author: "A", emoji: "🔥" }],
          },
        },
      });
    }

    // 7. Seed Time Capsules
    console.log("\n[4/6] Seeding 4 Time Capsules...");
    await prisma.timeCapsule.createMany({
      data: [
        {
          coupleId,
          message: "Our 2-Year Capsule: Let's open this on New Year's 2027! I hope we have visited Japan and bought a house by then!",
          unlockDate: new Date("2027-01-01T00:00:00.000Z"),
          sealedBy: "A",
          isUnlocked: false,
        },
        {
          coupleId,
          message: "Secrets from our early days: Remember the burnt pizza on date #3? We laughed until our tummies hurt!",
          unlockDate: new Date("2025-06-01T00:00:00.000Z"),
          sealedBy: "B",
          isUnlocked: true,
        },
        {
          coupleId,
          message: "Letters for the Future: A sweet surprise letter for Juliet's next birthday!",
          unlockDate: new Date("2026-11-15T00:00:00.000Z"),
          sealedBy: "A",
          isUnlocked: false,
        },
        {
          coupleId,
          message: "Summer Memory Capsule: Unlocked after our beach getaway in Florence!",
          unlockDate: new Date("2026-06-20T00:00:00.000Z"),
          sealedBy: "B",
          isUnlocked: true,
        },
      ],
    });

    // 8. Seed Custom Quiz Packs & Quiz History
    console.log("\n[5/6] Seeding Quizzes & Quiz Memories...");
    await prisma.customQuizPack.createMany({
      data: [
        {
          coupleId,
          name: "How Well Do You Know Romeo?",
          description: "A fun custom quiz created by Romeo for Juliet!",
          coverEmoji: "🎯",
          questions: [
            {
              id: "q1",
              question: "What is Romeo's absolute favorite coffee drink?",
              options: ["Espresso", "Cappuccino with Oat Milk", "Iced Latte", "Americano"],
              correctAnswer: 1,
            },
            {
              id: "q2",
              question: "Where did we have our very first kiss?",
              options: ["By the river bank", "In the park", "Outside Caffe Dante", "At home"],
              correctAnswer: 0,
            },
          ],
        },
        {
          coupleId,
          name: "Juliet's Secret Preferences Quiz",
          description: "Test how deeply you understand Juliet's favorite things!",
          coverEmoji: "🌸",
          questions: [
            {
              id: "q1",
              question: "Which flower does Juliet love most?",
              options: ["Pink Roses", "Sunflowers", "Peonies", "Tulips"],
              correctAnswer: 2,
            },
          ],
        },
      ],
    });

    await prisma.quizMemory.createMany({
      data: [
        {
          coupleId,
          title: "Deep Connection Master Quiz",
          scoreA: 95,
          scoreB: 98,
          intimacyScore: 94,
          understandingScore: 96,
          date: new Date("2026-07-20T00:00:00.000Z"),
        },
        {
          coupleId,
          title: "First Anniversary Knowledge Clash",
          scoreA: 90,
          scoreB: 92,
          intimacyScore: 92,
          understandingScore: 94,
          date: new Date("2026-07-10T00:00:00.000Z"),
        },
      ],
    });

    // 9. Seed Weekly Quests & Decision Wheel Categories
    console.log("\n[6/6] Seeding Weekly Quests & Decision Wheel...");
    await prisma.weeklyQuest.createMany({
      data: [
        {
          coupleId,
          text: "Cook a new Italian pasta recipe together from scratch 🍝",
          completed: true,
          points: 50,
          icon: "🍳",
          weekNumber: 1,
        },
        {
          coupleId,
          text: "Have a sunset walk without checking phones 🌅",
          completed: true,
          points: 40,
          icon: "🚶",
          weekNumber: 1,
        },
        {
          coupleId,
          text: "Write each other a handwritten love note ✍️",
          completed: true,
          points: 60,
          icon: "💌",
          weekNumber: 1,
        },
        {
          coupleId,
          text: "Have an at-home movie & popcorn marathon 🍿",
          completed: false,
          points: 45,
          icon: "🎬",
          weekNumber: 2,
        },
        {
          coupleId,
          text: "Plan a surprise picnic at the park 🧺",
          completed: false,
          points: 70,
          icon: "🧺",
          weekNumber: 2,
        },
      ],
    });

    const wheelCat1 = await prisma.wheelCategory.create({
      data: {
        coupleId,
        name: "Tonight's Dinner Wheel 🍕",
        icon: "🍕",
        isCustom: true,
        items: [
          { text: "Homemade Pizza", emoji: "🍕" },
          { text: "Sushi Night", emoji: "🍣" },
          { text: "Taco Feast", emoji: "🌮" },
          { text: "Fresh Italian Pasta", emoji: "🍝" },
        ],
      },
    });

    const wheelCat2 = await prisma.wheelCategory.create({
      data: {
        coupleId,
        name: "Weekend Activity Wheel 🎡",
        icon: "🎡",
        isCustom: true,
        items: [
          { text: "Botanical Garden Walk", emoji: "🌺" },
          { text: "Museum Tour", emoji: "🏛️" },
          { text: "Baking Cookies Together", emoji: "🍪" },
          { text: "Stargazing Drive", emoji: "✨" },
        ],
      },
    });

    await prisma.decisionHistory.createMany({
      data: [
        {
          coupleId,
          text: "Homemade Pizza 🍕",
          emoji: "🍕",
          categoryName: wheelCat1.name,
          date: new Date("2026-07-22T00:00:00.000Z"),
          completed: true,
        },
        {
          coupleId,
          text: "Stargazing Drive ✨",
          emoji: "✨",
          categoryName: wheelCat2.name,
          date: new Date("2026-07-24T00:00:00.000Z"),
          completed: true,
        },
      ],
    });

    console.log("\n==================================================");
    console.log("🎉 Successfully Seeded Extra Rich Data for All Features!");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Error seeding more data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedMoreData();
