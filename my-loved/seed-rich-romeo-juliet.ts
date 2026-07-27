import { prisma } from "./lib/prisma";

async function seedRichRomeoJuliet() {
  console.log("==================================================");
  console.log("🌸 Seeding Extra Rich Data Exclusively for Romeo & Juliet...");
  console.log("==================================================");

  try {
    // Find main Couple
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
          memoryGuessScoreA: 340,
          memoryGuessScoreB: 365,
          memoryGuessStreak: 14,
          intimacyScore: 98,
          understandingScore: 99,
          completedWeeks: 8,
        },
      });
    } else {
      couple = await prisma.couple.update({
        where: { id: couple.id },
        data: {
          personAName: "Romeo",
          personBName: "Juliet",
          streakCount: 14,
          lastActiveStreak: 14,
          intimacyScore: 98,
          understandingScore: 99,
          completedWeeks: 8,
        },
      });
    }

    const coupleId = couple.id;
    console.log(`✅ Main Couple ID: ${coupleId}`);

    // Ensure Romeo & Juliet accounts exist
    await prisma.user.upsert({
      where: { clerkId: "mock_user_id" },
      update: { coupleId, role: "A" },
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
      update: { coupleId, role: "B" },
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

    // Clear sub-records for clean re-population
    await prisma.milestone.deleteMany({ where: { coupleId } });
    await prisma.note.deleteMany({ where: { coupleId } });
    await prisma.journalEntry.deleteMany({ where: { coupleId } });
    await prisma.timeCapsule.deleteMany({ where: { coupleId } });
    await prisma.customQuizPack.deleteMany({ where: { coupleId } });
    await prisma.quizMemory.deleteMany({ where: { coupleId } });
    await prisma.weeklyQuest.deleteMany({ where: { coupleId } });
    await prisma.wheelCategory.deleteMany({ where: { coupleId } });
    await prisma.decisionHistory.deleteMany({ where: { coupleId } });

    // 1. Seed 12 Relationship Milestones
    console.log("\n[1/7] Seeding 12 Detailed Milestones...");
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
          description: "We sat by the river, drinking cappuccino and talking until midnight.",
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
          description: "Welcomed our little golden retriever fur ball into our loving home!",
          icon: "🐶",
        },
        {
          coupleId,
          title: "Moved into Our Cozy Apartment 🏡",
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
          title: "Summer Beach Getaway in Amalfi 🏖️",
          date: new Date("2026-06-15T00:00:00.000Z"),
          description: "Sunbathing, ocean waves, and watching stars on the beach all night.",
          icon: "🌊",
        },
        {
          coupleId,
          title: "Romantic Stargazing Night ✨",
          date: new Date("2026-07-04T00:00:00.000Z"),
          description: "Laid out blankets on the hills under a crystal clear starry sky.",
          icon: "🌌",
        },
        {
          coupleId,
          title: "Paris Eiffel Tower Trip 🗼",
          date: new Date("2026-07-14T00:00:00.000Z"),
          description: "The city of love! Croissants for breakfast and sparkling lights at night.",
          icon: "🗼",
        },
      ],
    });

    // 2. Seed 12 Romantic Notes
    console.log("\n[2/7] Seeding 12 Romantic Sticky Notes...");
    await prisma.note.createMany({
      data: [
        {
          coupleId,
          text: "You make my heart smile in ways nobody else ever could! 💖",
          author: "Romeo",
          color: "rose",
          date: new Date("2026-07-18T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Thank you for making my coffee every morning. Small acts of love mean everything.",
          author: "Juliet",
          color: "purple",
          date: new Date("2026-07-19T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Forever is a long time, but I wouldn't mind spending every second with you. 🌌",
          author: "Romeo",
          color: "blue",
          date: new Date("2026-07-20T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Don't forget: date night this Friday at 7 PM! 🍝",
          author: "Juliet",
          color: "amber",
          date: new Date("2026-07-21T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Your laugh is my absolute favorite sound in the world. 🎶",
          author: "Romeo",
          color: "emerald",
          date: new Date("2026-07-22T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "I love the way you hold my hand when we cross the street. 🥰",
          author: "Juliet",
          color: "rose",
          date: new Date("2026-07-23T00:00:00.000Z"),
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
          text: "You're my home, no matter where we are in the world. ❤️",
          author: "Juliet",
          color: "purple",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Good morning sunshine! Have the most wonderful day at work! ☀️",
          author: "Romeo",
          color: "amber",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
        {
          coupleId,
          text: "Can we get gelato after dinner tonight please? 🍦",
          author: "Juliet",
          color: "pink",
          date: new Date("2026-07-24T00:00:00.000Z"),
        },
      ],
    });

    // 3. Seed 14 Days of Daily Feelings Journal (2 Full Weeks of Streak)
    console.log("\n[3/7] Seeding 14 Days of Journal Entries with Conversations...");
    const pastDates = [
      "2026-07-11", "2026-07-12", "2026-07-13", "2026-07-14", "2026-07-15",
      "2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20",
      "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24"
    ];

    const emotionsA = ["Loved 💖", "Grateful 🙏", "Excited 🎉", "Overjoyed ✨", "Blessed 😇"];
    const emotionsB = ["Happy 😊", "Peaceful 🌿", "Charmed 🥰", "Radiant 🌟", "Content 💕"];

    for (let i = 0; i < pastDates.length; i++) {
      const d = pastDates[i];
      const emoA = emotionsA[i % emotionsA.length];
      const emoB = emotionsB[i % emotionsB.length];

      await prisma.journalEntry.create({
        data: {
          coupleId,
          author: "A",
          date: d,
          emotion: emoA,
          content: `Romeo's Journal (${d}): ${emoA} - Had such a memorable day with Juliet. Every moment spent together is precious.`,
          comments: {
            create: [
              {
                author: "B",
                content: `Juliet: Loved this day too, Romeo! Thank you for always making me feel so special. ❤️`,
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
          emotion: emoB,
          content: `Juliet's Journal (${d}): ${emoB} - Cooking together and sharing laughs. Life is beautiful with you!`,
          comments: {
            create: [
              {
                author: "A",
                content: `Romeo: You are my heart and soul, my love! 🥰`,
              },
            ],
          },
          reactions: {
            create: [{ author: "A", emoji: "🔥" }],
          },
        },
      });
    }

    // 4. Seed Time Capsules
    console.log("\n[4/7] Seeding Time Capsules...");
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

    // 5. Seed Custom Quizzes & History
    console.log("\n[5/7] Seeding Quiz Packs & Quiz History...");
    await prisma.customQuizPack.createMany({
      data: [
        {
          coupleId,
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
          ],
        },
        {
          coupleId,
          name: "How Well Do You Know Romeo? 🎯",
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
            {
              id: "q3",
              question: "What is Romeo's go-to music genre on long road trips?",
              options: ["Acoustic & Indie Folk 🎸", "80s Synth Pop 🎶", "Classical Piano 🎹", "Jazz & Blues 🎷"],
              correctAnswer: 0,
            }
          ],
        },
        {
          coupleId,
          name: "Juliet's Secret Preferences Quiz 🌸",
          description: "Test how deeply you understand Juliet's favorite things!",
          coverEmoji: "🌸",
          questions: [
            {
              id: "q1",
              question: "Which flower does Juliet love most?",
              options: ["Pink Roses", "Sunflowers", "Peonies", "Tulips"],
              correctAnswer: 2,
            },
            {
              id: "q2",
              question: "What is Juliet's dream date night idea?",
              options: ["Candlelight dinner by the beach 🌅", "Stargazing rooftop picnic ✨", "Symphony orchestra concert 🎻", "Cozy bookstore exploration 📚"],
              correctAnswer: 1,
            }
          ],
        },
        {
          coupleId,
          name: "Deep Relationship Chemistry & Dreams 💫",
          description: "Deep talk questions for quiet evenings and heart-to-heart conversations.",
          coverEmoji: "💫",
          questions: [
            {
              id: "deep1",
              question: "What habit of mine makes you feel most loved and appreciated?",
              options: ["Morning coffee notes ☕", "Tight hugs when arriving home 🫂", "Listening attentively without distraction 👂", "Spontaneous forehead kisses 💋"],
              correctAnswer: 1,
            },
            {
              id: "deep2",
              question: "What is our biggest shared dream for our next 3 years together?",
              options: ["Buying our dream house 🏡", "Traveling across Japan & Europe ✈️", "Starting our own cozy business ☕", "Adopting another pet 🐶"],
              correctAnswer: 1,
            }
          ],
        }
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

    // 6. Seed Weekly Quests
    console.log("\n[6/7] Seeding Weekly Quests...");
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
          completed: true,
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

    // 7. Seed Decision Wheels & History
    console.log("\n[7/7] Seeding Decision Wheels & Logs...");
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
    console.log("🎉 Successfully Seeded Extra Rich Data Exclusively for Romeo & Juliet!");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedRichRomeoJuliet();
