import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        `${origin}/number-loved?invite_error=missing_token`
      );
    }

    // 1. Look up single-use token in database
    const invitation = await prisma.coupleInvitation.findUnique({
      where: { token },
      include: { couple: true },
    });

    if (!invitation) {
      // Legacy token fallback check
      try {
        const decodedStr = Buffer.from(token, "base64url").toString("utf-8");
        const tokenData = JSON.parse(decodedStr);
        if (tokenData && tokenData.coupleId) {
          return NextResponse.redirect(
            `${origin}/number-loved?invite=${encodeURIComponent(
              tokenData.senderName || "Partner"
            )}&connected=true&partner=${encodeURIComponent(
              tokenData.senderName || "Partner"
            )}`
          );
        }
      } catch (_) {}

      return NextResponse.redirect(
        `${origin}/number-loved?invite_error=invalid_token`
      );
    }

    // 2. Check if token has already been used
    if (invitation.isUsed) {
      return NextResponse.redirect(
        `${origin}/number-loved?invite_error=token_already_used`
      );
    }

    // 3. Check if token is expired
    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.redirect(
        `${origin}/number-loved?invite_error=token_expired`
      );
    }

    // 4. Mark token as used (single-use enforcement)
    await prisma.coupleInvitation.update({
      where: { id: invitation.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // 5. Update Couple record in database
    const coupleId = invitation.coupleId;
    const existingCouple = invitation.couple || (await prisma.couple.findUnique({ where: { id: coupleId } }));

    if (existingCouple) {
      const defaultBName =
        existingCouple.personBName &&
        existingCouple.personBName.toLowerCase() !== "juliet"
          ? existingCouple.personBName
          : "Juliet";

      await prisma.couple.update({
        where: { id: coupleId },
        data: {
          personBName: defaultBName,
        },
      });
    }

    // 6. Link current logged-in user if available
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

    // 7. Redirect recipient to Couple connection page to complete linking process
    const senderNameParam = encodeURIComponent(invitation.senderName || "Partner");
    return NextResponse.redirect(
      `${origin}/number-loved?invite=${senderNameParam}&connected=true&partner=${senderNameParam}`
    );
  } catch (error: any) {
    console.error("[GET /api/invite/confirm] Error:", error);
    return NextResponse.redirect(
      `${origin}/number-loved?invite_error=confirmation_failed`
    );
  }
}
