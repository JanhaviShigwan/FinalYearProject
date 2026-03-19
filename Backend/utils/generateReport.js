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

/* ── Brand palette ──────────────────────────────────────────────── */
const C = {
  deepSlate:  "#3F3D56",
  lavender:   "#9B96E5",
  coral:      "#F08A6C",
  warmCream:  "#F6F1EB",
  softBlush:  "#EED8D6",
  white:      "#FFFFFF",
  midGray:    "#C8C8C8",
  darkText:   "#2D2D2D",
};

const MARGIN = 50;
const CONTENT_TOP = 95;
const CONTENT_BOTTOM_GAP = 104;
const LOGO_PATH = path.join(
  __dirname, "..", "..", "Frontend", "eventsphere", "src", "assets", "EventSphereLogo.png"
);

/* ── Page chrome ────────────────────────────────────────────────── */
const drawPageHeader = (doc, logoBuffer) => {
  const W = doc.page.width;
  doc.save();
  doc.rect(0, 0, W, 74).fill(C.deepSlate);
  doc.rect(0, 74, W, 3).fill(C.lavender);
  if (logoBuffer) {
    try { doc.image(logoBuffer, MARGIN, 13, { width: 48, height: 48 }); } catch (_) {}
  }
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(18)
     .text("EventSphere", MARGIN + 58, 20, { lineBreak: false });
  doc.fillColor(C.lavender).font("Helvetica").fontSize(8)
     .text("Event Management Platform", MARGIN + 58, 42, { lineBreak: false });
  doc.fillColor(C.coral).font("Helvetica-Bold").fontSize(13)
     .text("EVENT REPORT", 0, 23, { align: "right", width: W - MARGIN, lineBreak: false });
  const dt = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  doc.fillColor(C.softBlush).font("Helvetica").fontSize(8)
     .text(`Generated: ${dt}`, 0, 43, { align: "right", width: W - MARGIN, lineBreak: false });
  doc.restore();
};

const drawPageFooter = (doc) => {
  const W = doc.page.width;
  const H = doc.page.height;
  const footerY = H - 84;
  doc.save();
  doc.rect(0, footerY, W, 34).fill(C.deepSlate);
  doc.rect(0, footerY - 3, W, 3).fill(C.lavender);
  doc.fillColor(C.softBlush).font("Helvetica").fontSize(8)
    .text("EventSphere \u2014 Confidential Event Report", MARGIN, footerY + 13, { lineBreak: false });
  doc.fillColor(C.softBlush).font("Helvetica").fontSize(8)
    .text("\u00A9 2026 EventSphere", 0, footerY + 13, { align: "right", width: W - MARGIN, lineBreak: false });
  doc.restore();
};

const addStyledPage = (doc, logoBuffer) => {
  doc.addPage();
  drawPageHeader(doc, logoBuffer);
  drawPageFooter(doc);
  doc.x = MARGIN;
  doc.y = CONTENT_TOP;
};

/* ── Layout helpers ─────────────────────────────────────────────── */
const getCw = (doc) => doc.page.width - MARGIN * 2;

const sectionHeader = (doc, title) => {
  const w = getCw(doc);
  const y = doc.y + 6;
  doc.rect(MARGIN, y, w, 26).fill(C.lavender);
  doc.rect(MARGIN, y, 5, 26).fill(C.coral);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(10)
     .text(title.toUpperCase(), MARGIN + 14, y + 8, { lineBreak: false });
  doc.fillColor(C.darkText);
  doc.y = y + 34;
};

const infoRow = (doc, label, value, isOdd) => {
  const w = getCw(doc);
  const colW = w / 2;
  const rowH = 24;
  const y = doc.y;
  doc.rect(MARGIN, y, w, rowH).fill(isOdd ? C.warmCream : C.white);
  doc.rect(MARGIN, y + rowH - 1, w, 1).fill(C.midGray);
  doc.fillColor(C.deepSlate).font("Helvetica-Bold").fontSize(10)
     .text(label, MARGIN + 10, y + 7, { lineBreak: false });
  doc.fillColor(C.darkText).font("Helvetica").fontSize(10)
     .text(String(value || "N/A"), MARGIN + colW + 10, y + 7, { width: colW - 20, lineBreak: false });
  doc.y = y + rowH;
};

const getTextBlockMetrics = (doc, content) => {
  const w = getCw(doc);
  const body = content || "N/A";
  doc.font("Helvetica").fontSize(10);
  const bodyH = doc.heightOfString(body, { width: w - 24 }) + 20;

  return {
    body,
    bodyH,
    totalH: 4 + 22 + bodyH + 14,
  };
};

const textBlock = (doc, label, content, checkBreak) => {
  const w = getCw(doc);
  const metrics = getTextBlockMetrics(doc, content);
  checkBreak(metrics.totalH);
  const hdrY = doc.y + 4;
  doc.rect(MARGIN, hdrY, w, 22).fill(C.softBlush);
  doc.rect(MARGIN, hdrY, 4, 22).fill(C.lavender);
  doc.fillColor(C.deepSlate).font("Helvetica-Bold").fontSize(10)
     .text(label, MARGIN + 12, hdrY + 6, { lineBreak: false });
  const bodyY = hdrY + 22;
  doc.rect(MARGIN, bodyY, w, metrics.bodyH).fill(C.white);
  doc.rect(MARGIN, bodyY, w, metrics.bodyH).lineWidth(0.5).stroke(C.midGray);
  doc.fillColor(C.darkText).font("Helvetica").fontSize(10)
     .text(metrics.body, MARGIN + 12, bodyY + 10, { width: w - 24 });
  doc.y = bodyY + metrics.bodyH + 14;
};

const statsRow = (doc, stats) => {
  const w = getCw(doc);
  const gap = 12;
  const n = stats.length;
  const boxW = (w - gap * (n - 1)) / n;
  const boxH = 64;
  const y = doc.y + 6;
  stats.forEach((s, i) => {
    const x = MARGIN + i * (boxW + gap);
    doc.rect(x, y, boxW, boxH).fill(s.bg || C.warmCream);
    doc.rect(x, y, boxW, boxH).lineWidth(1).stroke(s.border || C.lavender);
    doc.rect(x, y, 4, boxH).fill(s.accent || C.lavender);
    doc.fillColor(s.accent || C.lavender).font("Helvetica-Bold").fontSize(24)
       .text(String(s.value), x + 14, y + 9, { lineBreak: false });
    doc.fillColor(C.deepSlate).font("Helvetica").fontSize(9)
       .text(s.label, x + 14, y + 42, { lineBreak: false, width: boxW - 22 });
  });
  doc.y = y + boxH + 14;
};

const ratingRow = (doc, ratingStr) => {
  const filled = Math.round(parseFloat(ratingStr));
  const y = doc.y + 2;
  doc.fillColor(C.deepSlate).font("Helvetica-Bold").fontSize(10)
     .text("Overall Rating:", MARGIN, y + 4, { lineBreak: false });

  for (let i = 0; i < 5; i++) {
    const dotX = MARGIN + 111 + i * 22;
    const dotY = y + 10;
    doc.save();
    doc.circle(dotX, dotY, 6).fill(i < filled ? C.coral : C.white);
    doc.circle(dotX, dotY, 6).lineWidth(1).stroke(i < filled ? C.coral : C.midGray);
    doc.restore();
  }

  doc.fillColor(C.deepSlate).font("Helvetica").fontSize(10)
     .text(`(${ratingStr} / 5)`, MARGIN + 224, y + 4, { lineBreak: false });
  doc.y = y + 28;
};

const getFeedbackSummaryMinHeight = () => 34 + 84 + 36;

const addFeedbackSummary = (doc, feedbacks, checkBreak) => {
  const w = getCw(doc);
  checkBreak(getFeedbackSummaryMinHeight());
  sectionHeader(doc, "Feedback Summary");

  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    doc.fillColor(C.darkText).font("Helvetica").fontSize(11)
       .text("No feedback submitted for this event.", MARGIN, doc.y + 8);
    doc.y += 30;
    return;
  }

  const count = feedbacks.length;
  const avg = (feedbacks.reduce((s, f) => s + Number(f.rating || 0), 0) / count).toFixed(1);

  statsRow(doc, [
    { label: "Total Responses", value: count,         bg: C.warmCream, border: C.lavender, accent: C.lavender },
    { label: "Average Rating",  value: `${avg} / 5`,  bg: "#FFF5F0",   border: C.coral,   accent: C.coral    },
  ]);

  ratingRow(doc, avg);
  doc.y += 8;

  const comments = feedbacks.map((f) => (f.comment || "").trim()).filter(Boolean).slice(0, 8);
  if (comments.length === 0) return;

  checkBreak(60);
  const hdrY = doc.y;
  doc.rect(MARGIN, hdrY, w, 22).fill(C.softBlush);
  doc.rect(MARGIN, hdrY, 4, 22).fill(C.lavender);
  doc.fillColor(C.deepSlate).font("Helvetica-Bold").fontSize(10)
     .text("Student Comments", MARGIN + 12, hdrY + 6, { lineBreak: false });
  doc.y = hdrY + 30;

  comments.forEach((comment, idx) => {
    checkBreak(48);
    const cy = doc.y;
    doc.font("Helvetica").fontSize(10);
    const innerH = doc.heightOfString(comment, { width: w - 56 });
    const boxH = Math.max(44, innerH + 22);
    doc.rect(MARGIN, cy, w, boxH).fill(idx % 2 === 0 ? C.warmCream : C.white);
    doc.rect(MARGIN, cy, w, boxH).lineWidth(0.5).stroke(C.midGray);
    doc.circle(MARGIN + 18, cy + boxH / 2, 11).fill(C.lavender);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text(String(idx + 1), MARGIN + 14, cy + boxH / 2 - 6, { lineBreak: false });
    doc.fillColor(C.darkText).font("Helvetica").fontSize(10)
       .text(comment, MARGIN + 38, cy + 11, { width: w - 56 });
    doc.y = cy + boxH + 6;
  });
};

/* ── Main export ────────────────────────────────────────────────── */
const generateEventReport = async (event, feedbacks = [], executionText = "") => {
  let logoBuffer = null;
  if (fs.existsSync(LOGO_PATH)) {
    try { logoBuffer = fs.readFileSync(LOGO_PATH); } catch (_) {}
  }

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 90, bottom: 50, left: MARGIN, right: MARGIN },
    autoFirstPage: false,
  });

  const getContentBottom = () => doc.page.height - CONTENT_BOTTOM_GAP;

  const checkBreak = (minH = 80) => {
    if (doc.y + minH > getContentBottom()) {
      addStyledPage(doc, logoBuffer);
    }
  };

  addStyledPage(doc, logoBuffer);

  /* ── Event name banner ── */
  const w = getCw(doc);
  const bannerY = doc.y + 2;
  doc.rect(MARGIN, bannerY, w, 54).fill(C.warmCream);
  doc.rect(MARGIN, bannerY, w, 54).lineWidth(1).stroke(C.softBlush);
  doc.rect(MARGIN, bannerY, 6, 54).fill(C.coral);
  doc.fillColor(C.coral).font("Times-Bold").fontSize(22)
     .text(event.eventName || "Untitled Event", MARGIN + 16, bannerY + 8, { width: w - 30, lineBreak: false });
  doc.fillColor(C.deepSlate).font("Helvetica").fontSize(9)
     .text(event.category ? `Category: ${event.category}` : "", MARGIN + 16, bannerY + 38, { lineBreak: false });
  doc.y = bannerY + 62;

  /* ── Event Details ── */
  sectionHeader(doc, "Event Details");
  [
    ["Event Name", event.eventName],
    ["Date",       event.date],
    ["Time",       event.time],
    ["Venue",      event.venue],
    ["Category",   event.category],
    ["Capacity",   event.totalCapacity],
  ].forEach(([label, val], i) => infoRow(doc, label, val, i % 2 === 0));
  doc.y += 16;

  /* ── Descriptions ── */
  checkBreak(34 + getTextBlockMetrics(doc, event.shortDescription).totalH);
  sectionHeader(doc, "Event Description");
  textBlock(doc, "Short Description",    event.shortDescription, checkBreak);
  textBlock(doc, "Detailed Description", event.longDescription,  checkBreak);

  /* ── Execution ── */
  if (executionText && executionText.trim()) {
    checkBreak(34 + getTextBlockMetrics(doc, executionText).totalH);
    sectionHeader(doc, "Event Execution");
    textBlock(doc, "Execution Summary", executionText, checkBreak);
  }

  /* ── Event Image ── */
  const imageBuffer = await resolveImageBuffer(event.eventImage || event.imageUrl || "");
  checkBreak(180);
  sectionHeader(doc, "Event Image");
  if (imageBuffer) {
    try {
      const imgY = doc.y + 6;
      doc.rect(MARGIN, imgY, w, 210).fill(C.warmCream);
      doc.rect(MARGIN, imgY, w, 210).lineWidth(1).stroke(C.softBlush);
      doc.image(imageBuffer, MARGIN + 10, imgY + 8, { fit: [w - 20, 194], align: "center" });
      doc.y = imgY + 218;
    } catch (_) {
      doc.fillColor(C.darkText).font("Helvetica").fontSize(11)
         .text("Image could not be rendered.", MARGIN, doc.y + 6);
      doc.y += 28;
    }
  } else {
    doc.fillColor(C.darkText).font("Helvetica").fontSize(11)
       .text("No image available.", MARGIN, doc.y + 6);
    doc.y += 28;
  }

  /* ── Feedback ── */
  doc.y += 8;
  addFeedbackSummary(doc, feedbacks, checkBreak);

  return doc;
};

module.exports = { generateEventReport };
