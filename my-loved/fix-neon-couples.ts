import { prisma } from "./lib/prisma";

async function fixNeonCouples() {
  console.log("==================================================");
  console.log("🔍 Inspecting All Couples and Users in Neon DB...");
  console.log("==================================================");

  try {
    const allCouples = await prisma.couple.findMany({
      include: { users: true },
    });

    console.log(`Found ${allCouples.length} Couple record(s) in DB:`);
    allCouples.forEach((c, idx) => {
      console.log(`\n[Couple #${idx + 1}] ID: ${c.id}`);
      console.log(`  Names: ${c.personAName} & ${c.personBName}`);
      console.log(`  Users linked (${c.users.length}):`);
      c.users.forEach((u) => {
        console.log(`    - Name: ${u.name} | ClerkID: ${u.clerkId} | Email: ${u.email} | Role: ${u.role}`);
      });
    });

    const allUsers = await prisma.user.findMany();
    console.log(`\nAll Users (${allUsers.length}):`);
    allUsers.forEach((u) => {
      console.log(`- ${u.name} (${u.email}) | ClerkID: ${u.clerkId} | CoupleID: ${u.coupleId}`);
    });

    // Clean up unwanted non-Romeo/Juliet users
    const validClerkIds = ["mock_user_id", "user_juliet_456"];
    const invalidUsers = allUsers.filter((u) => !validClerkIds.includes(u.clerkId));

    if (invalidUsers.length > 0) {
      console.log(`\nRemoving ${invalidUsers.length} invalid user(s)...`);
      for (const iu of invalidUsers) {
        await prisma.user.delete({ where: { id: iu.id } });
        console.log(`✅ Deleted user: ${iu.name} (${iu.email})`);
      }
    }

    // Keep ONLY 1 main Couple record
    if (allCouples.length > 1) {
      const mainCouple = allCouples[0];
      const extraCouples = allCouples.slice(1);

      console.log(`\nKeeping main Couple ID: ${mainCouple.id}`);
      console.log(`Deleting ${extraCouples.length} duplicate Couple record(s)...`);

      for (const ec of extraCouples) {
        // Point any users to mainCouple first
        await prisma.user.updateMany({
          where: { coupleId: ec.id },
          data: { coupleId: mainCouple.id },
        });

        await prisma.couple.delete({ where: { id: ec.id } });
        console.log(`✅ Deleted extra couple: ${ec.id}`);
      }
    }

    // Ensure Romeo & Juliet exist and point to the single main Couple
    let finalCouple = await prisma.couple.findFirst();
    if (!finalCouple) {
      finalCouple = await prisma.couple.create({
        data: {
          personAName: "Romeo",
          personBName: "Juliet",
          personADesc: "My Universe 🌌",
          personBDesc: "My Anchor ⚓",
          anniversaryDate: new Date("2025-01-01"),
          customTitle: "Romeo & Juliet's Love Story",
          themeId: "rose-gold",
        },
      });
    }

    // Re-link Romeo (mock_user_id) & Juliet (user_juliet_456)
    await prisma.user.upsert({
      where: { clerkId: "mock_user_id" },
      update: { coupleId: finalCouple.id, role: "A" },
      create: {
        clerkId: "mock_user_id",
        email: "romeo@verona.it",
        firstName: "Romeo",
        lastName: "Montague",
        name: "Romeo Montague",
        role: "A",
        coupleId: finalCouple.id,
      },
    });

    await prisma.user.upsert({
      where: { clerkId: "user_juliet_456" },
      update: { coupleId: finalCouple.id, role: "B" },
      create: {
        clerkId: "user_juliet_456",
        email: "juliet@verona.it",
        firstName: "Juliet",
        lastName: "Capulet",
        name: "Juliet Capulet",
        role: "B",
        coupleId: finalCouple.id,
      },
    });

    // Final verification log
    const finalUsers = await prisma.user.findMany({ include: { couple: true } });
    const finalCouples = await prisma.couple.findMany();

    console.log("\n==================================================");
    console.log(`🎉 Final Database State:`);
    console.log(`  Couples Count: ${finalCouples.length} (ID: ${finalCouples[0]?.id})`);
    console.log(`  Users Count: ${finalUsers.length}`);
    finalUsers.forEach((u) => {
      console.log(`   - ${u.name} (${u.email}) -> Role ${u.role} in Couple ${u.coupleId}`);
    });
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Error fixing couples:", err);
  } finally {
    await prisma.$disconnect();
  }
}

fixNeonCouples();
