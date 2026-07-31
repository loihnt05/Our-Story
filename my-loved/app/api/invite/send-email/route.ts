import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    let coupleId: string | null = null;
    let senderName = "Your Partner";
    let senderId: string | null = null;

    try {
      const dbUser = await getCurrentDbUser();
      if (dbUser) {
        senderId = dbUser.id;
        coupleId = dbUser.coupleId;
        if (dbUser.couple?.personAName) {
          senderName = dbUser.couple.personAName;
        } else if (dbUser.firstName || dbUser.name) {
          senderName = dbUser.firstName || dbUser.name || "Your Partner";
        }
      }
    } catch (e) {
      console.log("[POST /api/invite/send-email] Guest or auth fallback");
    }

    const body = await req.json();
    const { partnerEmail, senderName: inputSenderName } = body;

    if (inputSenderName && typeof inputSenderName === "string" && inputSenderName.trim()) {
      senderName = inputSenderName.trim();
    }

    if (!partnerEmail || typeof partnerEmail !== "string" || !partnerEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid partner email address is required." },
        { status: 400 }
      );
    }

    // Find or fallback couple space if coupleId is null
    if (!coupleId) {
      const firstCouple = await prisma.couple.findFirst({
        orderBy: { createdAt: "asc" },
      });

      if (firstCouple) {
        coupleId = firstCouple.id;
      } else {
        const newCouple = await prisma.couple.create({
          data: {
            personAName: senderName,
            personBName: "Juliet",
          },
        });
        coupleId = newCouple.id;
      }
    }

    // Generate secure, unique single-use token
    const token = crypto.randomBytes(32).toString("hex");

    // Expiration: 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save single-use token to database
    await prisma.coupleInvitation.create({
      data: {
        token,
        senderId,
        senderName,
        recipientEmail: partnerEmail.trim().toLowerCase(),
        coupleId,
        expiresAt,
        isUsed: false,
      },
    });

    // Origin calculation
    const host = req.headers.get("host") || "localhost:3000";
    const protocol =
      req.headers.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    const confirmUrl = `${origin}/api/invite/confirm?token=${token}`;

    // Automatically send invitation email
    const emailResult = await sendInviteEmail({
      partnerEmail: partnerEmail.trim(),
      senderName,
      confirmUrl,
      token,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: emailResult.previewUrl
        ? `Invitation generated! Delivered to live preview inbox. 📧`
        : `Invitation email automatically sent to ${partnerEmail}! 📧`,
      token,
      expiresAt: expiresAt.toISOString(),
      confirmUrl,
      previewUrl: emailResult.previewUrl || null,
      emailResult,
    });
  } catch (error: any) {
    console.error("[POST /api/invite/send-email] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send invitation email" },
      { status: 500 }
    );
  }
}
