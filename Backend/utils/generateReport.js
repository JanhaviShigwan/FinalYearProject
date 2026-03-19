const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const PDFDocument = require("pdfkit");

const fetchRemoteBuffer = (url) => {
  const transport = url.startsWith("https") ? https : http;

  return new Promise((resolve, reject) => {
    transport
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch image. Status ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      })
      .on("error", reject);
  });
};

const resolveImageBuffer = async (imageValue = "") => {
  if (!imageValue || typeof imageValue !== "string") {
    return null;
  }

  const raw = imageValue.trim();

  if (!raw) {
    return null;
  }

  if (raw.startsWith("data:image") && raw.includes("base64,")) {
    const base64Part = raw.split("base64,")[1] || "";
    if (!base64Part) {
      return null;
    }

    return Buffer.from(base64Part, "base64");
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return await fetchRemoteBuffer(raw);
    } catch (error) {
      return null;
    }
  }

  const normalized = raw.replace(/^\/+/, "");
  const absolutePath = path.isAbsolute(raw)
    ? raw
    : path.join(__dirname, "..", normalized);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  try {
    return fs.readFileSync(absolutePath);
  } catch (error) {
    return null;
  }
};

const formatLine = (label, value) => `${label}: ${value || "N/A"}`;

const addFeedbackSummary = (doc, feedbacks = []) => {
  doc.moveDown();
  doc.font("Helvetica-Bold").fontSize(14).text("Feedback Summary");
  doc.moveDown(0.4);

  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    doc.font("Helvetica").fontSize(11).text("No feedback submitted for this event.");
    return;
  }

  const averageRating = (
    feedbacks.reduce((sum, feedback) => sum + Number(feedback.rating || 0), 0) / feedbacks.length
  ).toFixed(1);

  doc.font("Helvetica").fontSize(11).text(`Responses: ${feedbacks.length}`);
  doc.font("Helvetica").fontSize(11).text(`Average Rating: ${averageRating}/5`);

  const comments = feedbacks
    .map((feedback) => (feedback.comment || "").trim())
    .filter(Boolean)
    .slice(0, 8);

  if (comments.length > 0) {
    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(11).text("Highlights:");

    comments.forEach((comment, index) => {
      doc.font("Helvetica").fontSize(10).text(`${index + 1}. ${comment}`);
    });
  }
};

const generateEventReport = async (event, feedbacks = [], executionText = "") => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.font("Helvetica-Bold").fontSize(20).text(event.eventName || "Event Report", { align: "center" });
  doc.moveDown(1);

  doc.font("Helvetica-Bold").fontSize(14).text("Event Details");
  doc.moveDown(0.4);

  doc.font("Helvetica").fontSize(11).text(formatLine("Event Name", event.eventName));
  doc.text(formatLine("Date", event.date));
  doc.text(formatLine("Time", event.time));
  doc.text(formatLine("Venue", event.venue));
  doc.text(formatLine("Category", event.category));
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").fontSize(12).text("Short Description");
  doc.font("Helvetica").fontSize(11).text(event.shortDescription || "N/A");
  doc.moveDown(0.6);

  doc.font("Helvetica-Bold").fontSize(12).text("Long Description");
  doc.font("Helvetica").fontSize(11).text(event.longDescription || "N/A");
  doc.moveDown(0.6);

  doc.moveDown();
  doc.font("Helvetica-Bold").fontSize(14).text("Event Execution");
  doc.moveDown();
  doc.font("Helvetica").fontSize(12).text(executionText || "N/A");
  doc.moveDown(0.8);

  const imageSource = event.eventImage || event.imageUrl || "";
  const imageBuffer = await resolveImageBuffer(imageSource);

  doc.font("Helvetica-Bold").fontSize(12).text("Event Image");
  doc.moveDown(0.5);

  if (imageBuffer) {
    try {
      doc.image(imageBuffer, {
        fit: [500, 260],
        align: "center",
      });
    } catch (error) {
      doc.font("Helvetica").fontSize(11).text("Image could not be rendered.");
    }
  } else {
    doc.font("Helvetica").fontSize(11).text("No image available.");
  }

  addFeedbackSummary(doc, feedbacks);

  return doc;
};

module.exports = { generateEventReport };
