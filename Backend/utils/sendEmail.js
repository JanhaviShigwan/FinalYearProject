const nodemailer = require("nodemailer");
const Student = require("../Models/Student");

const CATEGORY_LABELS = {
  REGISTRATION: "Register",
  EVENT_REGISTRATION: "Event Registration",
  EVENT_REMINDER: "Event Reminder",
  EVENT_CANCELLATION: "Event Cancelled",
  ANNOUNCEMENT: "New Announcement",
  PASSWORD_RESET: "Forgot Password",
  PASSWORD_CHANGED: "Password Changed",
  GENERAL: "General"
};

const TOPIC_ALIASES = {
  REGISTER: "REGISTRATION",
  REGISTRATION: "REGISTRATION",
  EVENT_REGISTRATION: "EVENT_REGISTRATION",
  EVENT_REMINDER: "EVENT_REMINDER",
  EVENT_CANCELLED: "EVENT_CANCELLATION",
  EVENT_CANCELLATION: "EVENT_CANCELLATION",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  NEW_ANNOUNCEMENT: "ANNOUNCEMENT",
  FORGOT_PASSWORD: "PASSWORD_RESET",
  PASSWORD_RESET: "PASSWORD_RESET",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  GENERAL: "GENERAL"
};

const normalizeTopic = (topic) => {
  if (!topic) {
    return null;
  }

  const key = String(topic)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return TOPIC_ALIASES[key] || null;
};

const inferTopic = (subject = "") => {
  const normalized = String(subject).toLowerCase();

  if (normalized.includes("event registration")) {
    return "EVENT_REGISTRATION";
  }

  if (normalized.includes("event reminder") || normalized.includes("reminder")) {
    return "EVENT_REMINDER";
  }

  if (
    normalized.includes("event cancelled") ||
    normalized.includes("event canceled") ||
    normalized.includes("event cancellation")
  ) {
    return "EVENT_CANCELLATION";
  }

  if (normalized.includes("new announcement") || normalized.includes("announcement")) {
    return "ANNOUNCEMENT";
  }

  if (normalized.includes("welcome") || normalized.includes("register")) {
    return "REGISTRATION";
  }

  if (normalized.includes("reset password") || normalized.includes("otp")) {
    return "PASSWORD_RESET";
  }

  if (normalized.includes("password changed")) {
    return "PASSWORD_CHANGED";
  }

  return "GENERAL";
};

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

const sendEmail = async (to, subject, html, options = {}) => {
  const topic = normalizeTopic(options.topic) || inferTopic(subject);
  const category = CATEGORY_LABELS[topic] || topic;

  try {
    const requestedRecipients = normalizeRecipients(to);
    const bypassPreferenceCheck = options?.bypassPreferenceCheck === true;

    if (!requestedRecipients.length) {
      console.log(`[MAIL][${category}] FAILED | reason: recipient missing | subject: ${subject}`);
      return false;
    }

    let allowedRecipients = requestedRecipients;

    if (!bypassPreferenceCheck) {
      const matchingUsers = await Student.find({
        email: { $in: requestedRecipients },
      }).select("email role notificationPreferences");

      const blockedRecipientSet = new Set(
        matchingUsers
          .filter((user) => user.role === "admin" || user.notificationPreferences?.enabled === false)
          .map((user) => String(user.email || "").toLowerCase())
      );

      allowedRecipients = requestedRecipients.filter(
        (email) => !blockedRecipientSet.has(email)
      );

      if (!allowedRecipients.length) {
        console.log(
          `[MAIL][${category}] SKIPPED | reason: blocked by role/preferences | requested: ${requestedRecipients.join(", ")} | subject: ${subject}`
        );
        return true;
      }
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const secure = smtpPort === 465;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[MAIL][${category}] FAILED to ${to} | subject: ${subject}`);
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
      to: allowedRecipients.join(", "),
      subject: subject,
      html: html,
      ...(Array.isArray(options.attachments) && options.attachments.length > 0
        ? { attachments: options.attachments }
        : {})
    };

    console.log(`[MAIL] Sending Email | Category: ${category} | to: ${mailOptions.to} | subject: ${subject}`);

    const info = await transporter.sendMail(mailOptions);
    const deliveredTo = Array.isArray(info?.accepted) && info.accepted.length
      ? info.accepted.join(", ")
      : to;
    const timestamp = new Date().toLocaleString("en-IN", { hour12: true });

    console.log(`\n================ EMAIL SENT ================`);
    console.log(`  Category : ${category}`);
    console.log(`  To       : ${deliveredTo}`);
    console.log(`  Subject  : ${subject}`);
    console.log(`  Time     : ${timestamp}`);
    console.log(`  MsgId    : ${info?.messageId || "N/A"}`);
    console.log(`============================================\n`);

    return true;

  } catch (error) {
    const timestamp = new Date().toLocaleString("en-IN", { hour12: true });
    console.log(`\n=============== EMAIL FAILED ===============`);
    console.log(`  Category : ${category}`);
    console.log(`  To       : ${to}`);
    console.log(`  Subject  : ${subject}`);
    console.log(`  Time     : ${timestamp}`);
    console.log(`  Error    : ${error.message}`);
    console.log(`============================================\n`);
    return false;
  }
};

module.exports = sendEmail;