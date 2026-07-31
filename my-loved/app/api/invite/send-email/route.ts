import { getCurrentDbUser } from "@/lib/auth";
import { sendInviteEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser.coupleId) {
      return NextResponse.json({ error: "No active couple space found" }, { status: 400 });
    }

    const body = await req.json();
    const { partnerEmail, senderName } = body;

    if (!partnerEmail || typeof partnerEmail !== "string") {
      return NextResponse.json({ error: "Valid partner email is required" }, { status: 400 });
    }

    const hostSender = senderName || dbUser.couple?.personAName || "Your Partner";
    
    // Construct signed token payload
    const tokenData = {
      coupleId: dbUser.coupleId,
      senderName: hostSender,
      partnerEmail,
      createdAt: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(tokenData)).toString("base64url");
    
    // Origin calculation
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    const confirmUrl = `${origin}/api/invite/confirm?token=${encodeURIComponent(token)}`;

    const result = await sendInviteEmail({
      partnerEmail,
      senderName: hostSender,
      confirmUrl,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation email sent to ${partnerEmail}! 📧`,
      confirmUrl,
      result,
    });
  } catch (error: any) {
    console.error("[POST /api/invite/send-email] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send invitation email" },
      { status: 500 }
    );
  }
}
