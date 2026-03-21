const nodemailer = require("nodemailer");
const Student = require("../Models/Student");

const normalizeRecipients = (to) => {
  if (Array.isArray(to)) {
    return to
      .map((email) => String(email || "").trim().toLowerCase())
      .filter(Boolean);
  }

  return String(to || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const sendMail = async (to, subject, text, options = {}) => {
  try {
    if (!to || !subject || !text) {
      return false;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return false;
    }

    const requestedRecipients = normalizeRecipients(to);

    if (!requestedRecipients.length) {
      return false;
    }

    let allowedRecipients = requestedRecipients;

    if (options.type === "promo") {
      const matchingUsers = await Student.find({
        email: { $in: requestedRecipients },
      }).select("email emailNotifications");

      const blockedRecipientSet = new Set(
        matchingUsers
          .filter((user) => user?.emailNotifications === false)
          .map((user) => String(user.email || "").toLowerCase())
      );

      allowedRecipients = requestedRecipients.filter(
        (email) => !blockedRecipientSet.has(email)
      );
    }

    if (!allowedRecipients.length) {
      return true;
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
      to: allowedRecipients.join(", "),
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
