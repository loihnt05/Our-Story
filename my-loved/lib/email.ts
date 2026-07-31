import nodemailer from "nodemailer";

interface SendInviteEmailParams {
  partnerEmail: string;
  senderName: string;
  confirmUrl: string;
}

export async function sendInviteEmail({
  partnerEmail,
  senderName,
  confirmUrl,
}: SendInviteEmailParams) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || `"Our Love Story 💖" <noreply@ourstory.app>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited to Connect Our Anniversary Space 💖</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #faf5f5;
      margin: 0;
      padding: 0;
      color: #27272a;
    }
    .email-container {
      max-width: 580px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(244, 63, 94, 0.1), 0 8px 10px -6px rgba(244, 63, 94, 0.05);
      border: 1px solid #fecdd3;
    }
    .header-banner {
      background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header-banner h1 {
      margin: 10px 0 0 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .heart-icon {
      font-size: 48px;
      line-height: 1;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    .body-content {
      padding: 36px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #18181b;
      margin-bottom: 12px;
    }
    .message-text {
      font-size: 15px;
      line-height: 1.6;
      color: #52525b;
      margin-bottom: 28px;
    }
    .highlight-card {
      background: #fff1f2;
      border: 1px dashed #fda4af;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .highlight-card p {
      margin: 0;
      font-size: 14px;
      color: #e11d48;
      font-weight: 600;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 16px 36px;
      border-radius: 50px;
      box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);
      transition: all 0.2s ease;
    }
    .cta-button:hover {
      background: #e11d48;
    }
    .divider {
      height: 1px;
      background-color: #f4f4f5;
      margin: 32px 0 24px 0;
    }
    .footer-text {
      font-size: 12px;
      color: #a1a1aa;
      line-height: 1.5;
    }
    .link-fallback {
      font-size: 11px;
      color: #f43f5e;
      word-break: break-all;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-banner">
      <div class="heart-icon">💖</div>
      <h1>Our Love Story</h1>
    </div>

    <div class="body-content">
      <div class="greeting">You're Invited! 🌸</div>
      <p class="message-text">
        <strong>${senderName}</strong> has invited you to connect your shared anniversary space on <strong>Our Story</strong>!
      </p>

      <div class="highlight-card">
        <p>✨ Once you accept, your relationship countdown, shared journal entries, time capsules &amp; love quizzes will sync automatically together.</p>
      </div>

      <div style="margin-bottom: 24px;">
        <a href="${confirmUrl}" class="cta-button" target="_blank">
          Accept Invitation &amp; Connect Space 💖
        </a>
      </div>

      <p class="footer-text">
        If the button above does not work, copy and paste this link into your browser:
      </p>
      <div class="link-fallback">
        <a href="${confirmUrl}" style="color: #f43f5e;">${confirmUrl}</a>
      </div>

      <div class="divider"></div>

      <p class="footer-text">
        Created with ❤️ by Our Story App for ${senderName} &amp; ${partnerEmail}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: partnerEmail,
      subject: `You're invited by ${senderName} to connect your couple space! 💖`,
      html: htmlContent,
    });

    return { success: true, mode: "smtp" };
  } else {
    console.log("\n==================================================");
    console.log("💌 [EMAIL INVITE SENT SIMULATION]");
    console.log(`To: ${partnerEmail}`);
    console.log(`From Sender: ${senderName}`);
    console.log(`Confirm URL: ${confirmUrl}`);
    console.log("==================================================\n");

    return { success: true, mode: "simulation", confirmUrl };
  }
}
