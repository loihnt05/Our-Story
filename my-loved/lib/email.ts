import nodemailer from "nodemailer";

interface SendInviteEmailParams {
  partnerEmail: string;
  senderName: string;
  confirmUrl: string;
  token: string;
  expiresAt: Date;
}

export async function sendInviteEmail({
  partnerEmail,
  senderName,
  confirmUrl,
  token,
  expiresAt,
}: SendInviteEmailParams) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail =
    process.env.SMTP_FROM ||
    (smtpUser
      ? `"Our Love Story 💖" <${smtpUser}>`
      : `"Our Love Story 💖" <noreply@ourstory.app>`);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    confirmUrl
  )}`;
  const expiresFormatted = new Date(expiresAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited to Connect Our Love Story 💖</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #fff5f7;
      margin: 0;
      padding: 0;
      color: #27272a;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #fff5f7;
      padding: 40px 16px;
    }
    .email-card {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(244, 63, 94, 0.18), 0 0 0 1px rgba(251, 207, 232, 0.6);
    }
    .header-banner {
      background: linear-gradient(135deg, #ff4d6d 0%, #ff758f 40%, #e056fd 100%);
      padding: 44px 30px;
      text-align: center;
      color: #ffffff;
      position: relative;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .header-banner h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .heart-logo {
      font-size: 54px;
      line-height: 1;
      margin-bottom: 12px;
      display: inline-block;
    }
    .body-content {
      padding: 40px 36px;
      text-align: center;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 22px;
      font-weight: 700;
      color: #18181b;
      margin-bottom: 14px;
    }
    .message-text {
      font-size: 15px;
      line-height: 1.7;
      color: #52525b;
      margin-bottom: 30px;
    }
    .sender-highlight {
      color: #e11d48;
      font-weight: 700;
    }
    /* Romantic Feature Card */
    .feature-card {
      background: linear-gradient(180deg, #fff0f5 0%, #fffdfd 100%);
      border: 1.5px solid #fecdd3;
      border-radius: 24px;
      padding: 24px 20px;
      margin-bottom: 32px;
      text-align: left;
    }
    .feature-title {
      font-size: 13px;
      font-weight: 800;
      color: #be185d;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 16px;
      text-align: center;
    }
    .feature-item {
      display: table;
      width: 100%;
      margin-bottom: 12px;
    }
    .feature-icon {
      display: table-cell;
      width: 32px;
      font-size: 20px;
      vertical-align: middle;
    }
    .feature-text {
      display: table-cell;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      vertical-align: middle;
    }
    .feature-text strong {
      color: #0f172a;
    }
    /* CTA Button */
    .cta-container {
      margin: 36px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #ff2a5f 0%, #e11d48 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 17px;
      font-weight: 800;
      padding: 18px 44px;
      border-radius: 50px;
      box-shadow: 0 12px 24px -4px rgba(244, 63, 94, 0.4);
      letter-spacing: 0.2px;
    }
    /* QR Code Card */
    .qr-card {
      background: #ffffff;
      border: 2px dashed #f472b6;
      border-radius: 24px;
      padding: 24px 20px;
      margin: 32px auto;
      max-width: 260px;
      box-shadow: 0 10px 20px -5px rgba(244, 63, 94, 0.08);
    }
    .qr-header {
      font-size: 11px;
      font-weight: 800;
      color: #db2777;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    .qr-image {
      display: block;
      margin: 0 auto;
      border-radius: 16px;
      border: 1px solid #fbcfe8;
      background: #ffffff;
      padding: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .qr-subtext {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 10px;
      font-weight: 600;
    }
    /* Security & Token Info */
    .security-badge {
      display: inline-block;
      background: #fff1f2;
      border: 1px solid #ffe4e6;
      border-radius: 30px;
      padding: 8px 18px;
      font-size: 12px;
      color: #e11d48;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .token-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #64748b;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 4px 12px;
      border-radius: 6px;
      display: inline-block;
      margin-top: 6px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #f1f5f9 50%, transparent 100%);
      margin: 32px 0 24px 0;
    }
    .fallback-box {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 14px;
      padding: 14px;
      margin-top: 10px;
      word-break: break-all;
    }
    .fallback-url {
      font-size: 11px;
      color: #ff2a5f;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      
      <!-- Romantic Banner -->
      <div class="header-banner">
        <div class="badge">✨ Couple Space Invitation ✨</div>
        <div class="heart-logo">💖</div>
        <h1>Our Love Story</h1>
      </div>

      <!-- Main Body -->
      <div class="body-content">
        <div class="greeting">You're Invited to Connect! 🌸</div>
        
        <p class="message-text">
          Hi! <span class="sender-highlight">${senderName}</span> has invited you to connect your anniversary profiles on <strong>Our Story</strong>. Together, you will build a private space dedicated to your love!
        </p>

        <!-- Feature Card -->
        <div class="feature-card">
          <div class="feature-title">✨ What You'll Unlock Together</div>
          
          <div class="feature-item">
            <div class="feature-icon">⏳</div>
            <div class="feature-text">
              <strong>Anniversary Countdown:</strong> Track your relationship milestones down to the exact second.
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">📔</div>
            <div class="feature-text">
              <strong>Daily Feelings Journal:</strong> Share daily mood emojis, secret thoughts &amp; love notes.
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">💌</div>
            <div class="feature-text">
              <strong>Time Capsules &amp; Quizzes:</strong> Seal future memories &amp; challenge each other with love trivia!
            </div>
          </div>
        </div>

        <!-- Primary CTA Button -->
        <div class="cta-container">
          <a href="${confirmUrl}" class="cta-button" target="_blank">
            Verify and Connect 💖
          </a>
        </div>

        <!-- Cute QR Code Section -->
        <div class="qr-card">
          <div class="qr-header">📱 Scan with Camera to Connect</div>
          <a href="${confirmUrl}" target="_blank">
            <img src="${qrCodeUrl}" alt="Scan QR Code to Verify and Connect" width="180" height="180" class="qr-image" />
          </a>
          <div class="qr-subtext">Opens your instant couple connection page</div>
        </div>

        <!-- Security & Single-Use Token Note -->
        <div style="margin-top: 28px;">
          <div class="security-badge">
            🔒 Secure Single-Use Token • Valid until: ${expiresFormatted}
          </div>
          <br />
          <div class="token-pill">
            Token ID: ${token.substring(0, 16)}...
          </div>
        </div>

        <div class="divider"></div>

        <!-- Direct Link Fallback -->
        <p class="footer-text" style="margin-bottom: 6px;">
          If the button or QR code above does not open, copy and paste this verification link into your browser:
        </p>
        <div class="fallback-box">
          <a href="${confirmUrl}" class="fallback-url">${confirmUrl}</a>
        </div>

        <div class="divider"></div>

        <p class="footer-text">
          Created with endless ❤️ by <strong>Our Story</strong> for ${senderName} &amp; ${partnerEmail}
        </p>

      </div>
    </div>
  </div>
</body>
</html>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromEmail,
        to: partnerEmail,
        subject: `Verify & Connect: You're invited by ${senderName} to join your couple space! 💖`,
        html: htmlContent,
      });

      console.log(`[SMTP SENT SUCCESS] Sent to ${partnerEmail}, MessageId: ${info.messageId}`);
      return { success: true, mode: "smtp", messageId: info.messageId };
    } catch (err: any) {
      console.error("[SMTP ERROR] Failed to deliver via SMTP:", err);
      return { success: false, error: err.message || "Failed to send email via SMTP" };
    }
  } else {
    // Ethereal auto-test inbox fallback when SMTP credentials are not yet populated in .env.local
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Our Love Story 💖" <${testAccount.user}>`,
        to: partnerEmail,
        subject: `Verify & Connect: You're invited by ${senderName} to join your couple space! 💖`,
        html: htmlContent,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[ETHEREAL PREVIEW] Web preview link: ${previewUrl}`);

      return {
        success: true,
        mode: "ethereal",
        previewUrl,
        confirmUrl,
      };
    } catch (e) {
      return { success: true, mode: "simulation", confirmUrl };
    }
  }
}
