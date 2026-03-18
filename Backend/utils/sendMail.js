const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    if (!to || !subject || !text) {
      return false;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return false;
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const secure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      requireTLS: !secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        servername: smtpHost,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"EventSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error("sendMail error:", error.message);
    return false;
  }
};

module.exports = sendMail;
