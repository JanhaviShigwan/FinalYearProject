const nodemailer = require("nodemailer");

const inferTopic = (subject = "") => {
  const normalized = String(subject).toLowerCase();

  if (normalized.includes("welcome") || normalized.includes("register")) {
    return "REGISTRATION";
  }

  if (normalized.includes("reset password") || normalized.includes("otp")) {
    return "PASSWORD_RESET";
  }

  if (normalized.includes("password changed")) {
    return "PASSWORD_CHANGED";
  }

  if (normalized.includes("announcement")) {
    return "ANNOUNCEMENT";
  }

  if (normalized.includes("event registration")) {
    return "EVENT_REGISTRATION";
  }

  if (normalized.includes("event cancelled") || normalized.includes("canceled")) {
    return "EVENT_CANCELLATION";
  }

  return "GENERAL";
};

const sendEmail = async (to, subject, html, options = {}) => {
  const topic = options.topic || inferTopic(subject);

  try {

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const secure = smtpPort === 465;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[MAIL][${topic}] FAILED to ${to} | subject: ${subject}`);
      console.log("[MAIL][CONFIG] EMAIL_USER or EMAIL_PASS is missing");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      requireTLS: !secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        servername: smtpHost,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"EventSphere" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);

    console.log(`[MAIL][${topic}] Email sent successfully to ${to} | subject: ${subject}`);
    return true;

  } catch (error) {
    console.log(`[MAIL][${topic}] FAILED to ${to} | subject: ${subject}`);
    console.log(`[MAIL][${topic}] Error: ${error.message}`);
    return false;
  }
};

module.exports = sendEmail;