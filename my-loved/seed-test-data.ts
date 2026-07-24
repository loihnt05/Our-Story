import { prisma } from "./lib/prisma";

async function seedTestData() {
  console.log("==================================================");
  console.log("🌸 Seeding Test Users & Comprehensive Couple Data...");
  console.log("==================================================");

  try {
    // 1. Create/Upsert Couple
    console.log("\n[1/8] Creating Couple Record...");
    const couple = await prisma.couple.create({
      data: {
        personAName: "Romeo",
        personBName: "Juliet",
        personADesc: "My Universe 🌌",
        personBDesc: "My Anchor ⚓",
        personAAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        personBAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
        anniversaryDate: new Date("2025-01-01T00:00:00.000Z"),
        customTitle: "Romeo & Juliet's Love Story 💕",
        themeId: "rose-gold",
        secretNote: "My dearest Juliet, every single day with you feels like a beautiful dream. Yours forever and always. ❤️",
        streakCount: 7,
        lastActiveStreak: 7,
        recoveriesUsed: 1,
        recoveredDates: ["2026-07-01"],
        memoryGuessScoreA: 140,
        memoryGuessScoreB: 155,
        memoryGuessStreak: 5,
        intimacyScore: 88,
        understandingScore: 92,
        completedWeeks: 4,
      },
    });
    console.log(`✅ Couple created with ID: ${couple.id}`);

    // 2. Create 2 Users linked to this Couple
    console.log("\n[2/8] Creating 2 Test Users (Romeo & Juliet)...");
    
    // Cleanup any existing mock/test users if present
    await prisma.user.deleteMany({
      where: {
        clerkId: { in: ["mock_user_id", "user_romeo_123", "user_juliet_456"] },
      },
    });

    const userA = await prisma.user.create({
      data: {
        clerkId: "mock_user_id", // Default mock user for local testing
        email: "romeo@verona.it",
        firstName: "Romeo",
        lastName: "Montague",
        name: "Romeo Montague",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        role: "A",
        coupleId: couple.id,
      },
    });

    const userB = await prisma.user.create({
      data: {
        clerkId: "user_juliet_456",
        email: "juliet@verona.it",
        firstName: "Juliet",
        lastName: "Capulet",
        name: "Juliet Capulet",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
        role: "B",
        coupleId: couple.id,
      },
    });

    console.log(`✅ User A created: ${userA.name} (${userA.clerkId})`);
    console.log(`✅ User B created: ${userB.name} (${userB.clerkId})`);

    // 3. Create Timeline Milestones
    console.log("\n[3/8] Creating Relationship Milestones...");
    const milestones = await prisma.milestone.createMany({
      data: [
        {
          coupleId: couple.id,
          title: "First Met in Verona 🌸",
          date: new Date("2024-11-15T00:00:00.000Z"),
          description: "The unforgettable evening when our eyes met across the crowded room.",
          icon: "✨",
        },
        {
          coupleId: couple.id,
          title: "First Date at Caffe Dante ☕",
          date: new Date("2024-12-05T00:00:00.000Z"),
          description: "We sat by the river, drinking espresso and talking until midnight.",
          icon: "☕",
        },
        {
          coupleId: couple.id,
          title: "Officially Together 💕",
          date: new Date("2025-01-01T00:00:00.000Z"),
          description: "Under the New Year fireworks, we promised to walk through life together.",
          icon: "💖",
        },
        {
          coupleId: couple.id,
          title: "First Trip to Florence 🍕",
          date: new Date("2025-04-12T00:00:00.000Z"),
          description: "Exploring ancient streets, eating gelato, and watching sunsets over Ponte Vecchio.",
          icon: "🍕",
        },
      ],
    });
    console.log(`✅ Created ${milestones.count} milestones.`);

    // 4. Create Romantic Notes
    console.log("\n[4/8] Creating Romantic Notes...");
    const notes = await prisma.note.createMany({
      data: [
        {
          coupleId: couple.id,
          text: "You make my heart smile in ways nobody else ever could! 💖",
          author: "Romeo",
          color: "rose",
          date: new Date("2026-07-20T00:00:00.000Z"),
        },
        {
          coupleId: couple.id,
          text: "Thank you for making my coffee every morning. Small things mean everything.",
          author: "Juliet",
          color: "purple",
          date: new Date("2026-07-21T00:00:00.000Z"),
        },
        {
          coupleId: couple.id,
          text: "Forever is a long time, but I wouldn't mind spending every second with you. 🌌",
          author: "Romeo",
          color: "blue",
          date: new Date("2026-07-22T00:00:00.000Z"),
        },
        {
          coupleId: couple.id,
          text: "Don't forget: date night this Friday at 7 PM! 🍝",
          author: "Juliet",
          color: "amber",
          date: new Date("2026-07-23T00:00:00.000Z"),
        },
      ],
    });
    console.log(`✅ Created ${notes.count} romantic notes.`);

    // 5. Create Daily Journal Entries with Comments & Reactions
    console.log("\n[5/8] Creating Journal Entries, Comments, & Reactions...");
    const entry1 = await prisma.journalEntry.create({
      data: {
        coupleId: couple.id,
        author: "A",
        date: "2026-07-23",
        emotion: "Loved 💖",
        content: "Loved our quiet evening together listening to music. You make home feel like heaven.",
        comments: {
          create: [
            {
              author: "B",
              content: "Me too, my love! That playlist was so peaceful. 🥰",
            },
          ],
        },
        reactions: {
          create: [
            {
              author: "B",
              emoji: "❤️",
            },
          ],
        },
      },
    });

    const entry2 = await prisma.journalEntry.create({
      data: {
        coupleId: couple.id,
        author: "B",
        date: "2026-07-23",
        emotion: "Grateful 🙏",
        content: "Had a long day, but coming home to your big hug made all my stress melt away instantly.",
        comments: {
          create: [
            {
              author: "A",
              content: "Always here to hold you tight! ❤️",
            },
          ],
        },
        reactions: {
          create: [
            {
              author: "A",
              emoji: "🔥",
            },
          ],
        },
      },
    });
    console.log(`✅ Created journal entries with IDs: ${entry1.id}, ${entry2.id}`);

    // 6. Create Time Capsules
    console.log("\n[6/8] Creating Time Capsules...");
    const capsules = await prisma.timeCapsule.createMany({
      data: [
        {
          coupleId: couple.id,
          message: "Our 1-year memory capsule: Let's read this on our anniversary! I hope we've visited Japan by then!",
          unlockDate: new Date("2026-12-31T00:00:00.000Z"),
          sealedBy: "A",
          isUnlocked: false,
        },
        {
          coupleId: couple.id,
          message: "Secrets from our early days: Remember the burnt pizza on date #3? We laughed so hard!",
          unlockDate: new Date("2025-06-01T00:00:00.000Z"),
          sealedBy: "B",
          isUnlocked: true,
        },
      ],
    });
    console.log(`✅ Created ${capsules.count} time capsules.`);

    // 7. Create Custom Quizzes & Quiz Memories
    console.log("\n[7/8] Creating Quiz Packs & Quiz History...");
    const quizPack = await prisma.customQuizPack.create({
      data: {
        coupleId: couple.id,
        name: "How Well Do You Know Romeo?",
        description: "A fun custom quiz created by Romeo for Juliet!",
        coverEmoji: "🎯",
        questions: [
          {
            id: "q1",
            question: "What is Romeo's absolute favorite food?",
            options: ["Pizza Margherita", "Fresh Pasta Carbonara", "Gelato", "Tiramisu"],
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
    });

    const quizMemory = await prisma.quizMemory.create({
      data: {
        coupleId: couple.id,
        title: "Deep Connection Master Quiz",
        scoreA: 90,
        scoreB: 95,
        intimacyScore: 92,
        understandingScore: 95,
        date: new Date(),
      },
    });
    console.log(`✅ Created quiz pack (${quizPack.name}) & quiz memory record.`);

    // 8. Create Weekly Quests, Wheel Categories, & Decision History
    console.log("\n[8/8] Creating Weekly Quests & Decision Wheel Logs...");
    await prisma.weeklyQuest.createMany({
      data: [
        {
          coupleId: couple.id,
          text: "Cook a new Italian recipe together from scratch 🍝",
          completed: true,
          points: 50,
          icon: "🍳",
          weekNumber: 1,
        },
        {
          coupleId: couple.id,
          text: "Have a sunset walk without checking phones 🌅",
          completed: true,
          points: 40,
          icon: "🚶",
          weekNumber: 1,
        },
        {
          coupleId: couple.id,
          text: "Write each other a handwritten love note ✍️",
          completed: false,
          points: 60,
          icon: "💌",
          weekNumber: 1,
        },
      ],
    });

    const wheelCat = await prisma.wheelCategory.create({
      data: {
        coupleId: couple.id,
        name: "Tonight's Dinner Wheel 🍕",
        icon: "🍕",
        isCustom: true,
        items: [
          { text: "Homemade Pizza", emoji: "🍕" },
          { text: "Sushi Night", emoji: "🍣" },
          { text: "Taco Feast", emoji: "🌮" },
          { text: "Italian Pasta", emoji: "🍝" },
        ],
      },
    });

    await prisma.decisionHistory.create({
      data: {
        coupleId: couple.id,
        text: "Homemade Pizza 🍕",
        emoji: "🍕",
        categoryName: wheelCat.name,
        date: new Date(),
        completed: true,
      },
    });

    console.log("==================================================");
    console.log("🎉 Database Successfully Seeded with 2 Users & Full Features!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
