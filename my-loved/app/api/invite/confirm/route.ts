import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    if (!token) {
      return NextResponse.redirect(`${origin}/number-loved?error=missing_token`);
    }

    // Decode token
    const decodedStr = Buffer.from(token, "base64url").toString("utf-8");
    const tokenData = JSON.parse(decodedStr);

    const { coupleId, senderName, partnerEmail } = tokenData;

    if (!coupleId) {
      return NextResponse.redirect(`${origin}/number-loved?error=invalid_token`);
    }

    // 1. Update Couple in PostgreSQL DB
    const existingCouple = await prisma.couple.findUnique({ where: { id: coupleId } });

    if (existingCouple) {
      // Determine default partner B name
      const defaultBName = existingCouple.personBName && existingCouple.personBName.toLowerCase() !== "juliet"
        ? existingCouple.personBName
        : "Juliet";

      await prisma.couple.update({
        where: { id: coupleId },
        data: {
          personBName: defaultBName,
        },
      });
    }

    // 2. Link current logged-in user to couple if available
    try {
      const dbUser = await getCurrentDbUser();
      if (dbUser && dbUser.id) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            coupleId: coupleId,
            role: "B",
          },
        });
      }
    } catch (err) {
      console.log("[GET /api/invite/confirm] User linkage note:", err);
    }

    // Redirect partner to shared dashboard with celebration banner
    return NextResponse.redirect(
      `${origin}/number-loved?connected=true&partner=${encodeURIComponent(senderName || "Partner")}`
    );
  } catch (error: any) {
    console.error("[GET /api/invite/confirm] Error:", error);
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    return NextResponse.redirect(`${protocol}://${host}/number-loved?error=confirmation_failed`);
  }
}
