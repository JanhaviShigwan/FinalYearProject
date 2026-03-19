const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const EVENTSPHERE_LOGO_PATH = path.join(
  __dirname,
  "..",
  "..",
  "Frontend",
  "eventsphere",
  "src",
  "assets",
  "EventSphereLogo.png"
);

const sanitizeText = (value, fallback = "-") => {
  if (value === undefined || value === null) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
};

const drawSignatureBlock = ({
  doc,
  x,
  width,
  lineY,
  name,
  role,
}) => {
  doc.moveTo(x + 8, lineY).lineTo(x + width - 8, lineY).lineWidth(1).stroke("#3F3D56");

  const resolvedName = sanitizeText(name, "Event Coordinator");
  const resolvedRole = sanitizeText(role, "Authorized Signature");

  doc.fillColor("#3F3D56")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(resolvedName, x, lineY + 8, {
      width,
      align: "center",
    });

  const nameHeight = doc.heightOfString(resolvedName, {
    width,
    align: "center",
  });

  doc.fillColor("#3F3D56")
    .font("Helvetica")
    .fontSize(11)
    .text(resolvedRole, x, lineY + 12 + nameHeight, {
      width,
      align: "center",
    });
};

const drawFittedValue = ({
  doc,
  value,
  x,
  y,
  width,
  color,
  maxSize = 10.8,
  minSize = 8.6,
}) => {
  const safeValue = sanitizeText(value, "N/A");
  let text = `: ${safeValue}`;
  let fontSize = maxSize;

  doc.fillColor(color).font("Helvetica");

  while (fontSize > minSize) {
    doc.fontSize(fontSize);
    if (doc.widthOfString(text) <= width) {
      break;
    }
    fontSize -= 0.4;
  }

  doc.fontSize(fontSize);

  if (doc.widthOfString(text) > width) {
    let raw = `: ${safeValue}`;

    while (raw.length > 4 && doc.widthOfString(`${raw}...`) > width) {
      raw = raw.slice(0, -1);
    }

    text = `${raw}...`;
  }

  doc.text(text, x, y, {
    width,
    lineBreak: false,
  });
};

const formatCertificateIdForDisplay = (value) => {
  const text = sanitizeText(value, "N/A");

  if (text === "N/A") {
    return text;
  }

  if (text.length <= 18) {
    return text;
  }

  return `${text.slice(0, 10)}...${text.slice(-4)}`;
};

const formatOrganizerForDisplay = (value) => {
  const text = sanitizeText(value, "EventSphere");

  if (/college event management system|eventsphere/i.test(text)) {
    return "EventSphere";
  }

  return text;
};

const drawRandomSignature = ({
  doc,
  x,
  y,
  width,
  fallbackName,
  colors,
  inkPalette,
}) => {
  const normalizedName = sanitizeText(fallbackName, "Event Coordinator");
  const words = normalizedName.split(/\s+/).filter(Boolean);
  const first = words[0] || "E";
  const last = words.length > 1 ? words[words.length - 1] : "Coordinator";

  const variants = [
    `${first} ${last}`,
    `${first.charAt(0)}. ${last}`,
    `${first} ${last.charAt(0)}.`,
    `${first}`,
  ];

  const alias = variants[Math.floor(Math.random() * variants.length)];
  const inkChoices = Array.isArray(inkPalette) && inkPalette.length
    ? inkPalette
    : [colors.lavender, colors.coral, colors.deepSlate];
  const inkColor = inkChoices[Math.floor(Math.random() * inkChoices.length)];
  const font = Math.random() > 0.5 ? "Times-Italic" : "Helvetica-Oblique";
  const fontSize = 18 + Math.floor(Math.random() * 5);
  const yJitter = Math.floor(Math.random() * 5) - 2;

  doc.save();

  doc.fillColor(inkColor)
    .font(font)
    .fontSize(fontSize)
    .text(alias, x, y + yJitter, {
      width,
      align: "center",
      lineBreak: false,
    });

  const textWidth = doc.widthOfString(alias);
  const flourishStartX = x + (width - textWidth) / 2 - 6;
  const flourishEndX = flourishStartX + textWidth + 12;
  const baselineY = y + yJitter + fontSize + 1;
  const curveLift = 4 + Math.random() * 6;

  doc.strokeColor(inkColor)
    .lineWidth(1.2)
    .moveTo(flourishStartX, baselineY)
    .bezierCurveTo(
      flourishStartX + (flourishEndX - flourishStartX) * 0.25,
      baselineY - curveLift,
      flourishStartX + (flourishEndX - flourishStartX) * 0.65,
      baselineY + curveLift * 0.35,
      flourishEndX,
      baselineY - 1
    )
    .stroke();

  doc.restore();
};

const generateCertificate = ({
  studentName,
  eventName,
  eventDate,
  eventTime,
  eventVenue,
  organizer,
  certificateId,
  issueDate,
  signatureName,
  signatureRole,
}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, left: 60, right: 60, bottom: 50 },
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const hasLogo = fs.existsSync(EVENTSPHERE_LOGO_PATH);

    const colors = {
      lavender: "#9B96E5",
      coral: "#F08A6C",
      warmCream: "#F6F1EB",
      deepSlate: "#3F3D56",
      pastelGreen: "#D8E8D1",
      softBlush: "#EED8D6",
      white: "#FFFFFF",
    };

    const frameX = 34;
    const frameY = 30;
    const frameW = pageWidth - 68;
    const frameH = pageHeight - 60;

    const panelX = frameX + 34;
    const panelY = frameY + 34;
    const panelW = frameW - 68;
    const panelH = frameH - 68;

    doc.rect(frameX, frameY, frameW, frameH).fill(colors.deepSlate);
    doc.rect(frameX + 12, frameY + 12, frameW - 24, frameH - 24).lineWidth(2).stroke(colors.lavender);
    doc.rect(frameX + 20, frameY + 20, frameW - 40, frameH - 40).lineWidth(1).stroke(colors.softBlush);

    doc.roundedRect(panelX, panelY, panelW, panelH, 4).fill(colors.warmCream);
    doc.roundedRect(panelX, panelY, panelW, panelH, 4).lineWidth(1.2).stroke(colors.softBlush);
    doc.roundedRect(panelX + 8, panelY + 8, panelW - 16, panelH - 16, 2).lineWidth(0.8).stroke(colors.pastelGreen);

    const contentX = panelX + 26;
    const contentW = panelW - 52;
    const logoSize = 56;
    const logoX = panelX + (panelW - logoSize) / 2;
    const logoY = panelY + 18;

    doc.circle(pageWidth / 2, logoY + logoSize / 2, logoSize / 2 + 8)
      .fillAndStroke(colors.white, colors.softBlush);

    if (hasLogo) {
      doc.image(EVENTSPHERE_LOGO_PATH, logoX, logoY, {
        fit: [logoSize, logoSize],
        align: "center",
        valign: "center",
      });
    }

    let currentY = panelY + 92;

    doc.fillColor(colors.deepSlate)
      .font("Times-Bold")
      .fontSize(42)
      .text("CERTIFICATE", contentX, currentY, {
        width: contentW,
        align: "center",
      });

    currentY += 45;

    doc.fillColor(colors.deepSlate)
      .font("Times-Bold")
      .fontSize(18)
      .text("OF PARTICIPATION", contentX, currentY, {
        width: contentW,
        align: "center",
      });

    currentY += 34;

    doc.fillColor(colors.lavender)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PROUDLY PRESENTED TO", contentX, currentY, {
        width: contentW,
        align: "center",
      });

    currentY += 24;

    doc.fillColor(colors.deepSlate)
      .font("Times-BoldItalic")
      .fontSize(34)
      .text(sanitizeText(studentName, "Student Name"), contentX, currentY, {
        width: contentW,
        align: "center",
      });

    currentY += 56;

    doc.fillColor(colors.deepSlate)
      .font("Helvetica")
      .fontSize(11.5)
      .text(
        "in recognition of dedicated participation and valuable contribution to this college event.",
        contentX + 24,
        currentY,
        {
          width: contentW - 48,
          align: "center",
          lineGap: 3,
        }
      );

    currentY += 58;

    doc.fillColor(colors.coral)
      .font("Times-Bold")
      .fontSize(22)
      .text(sanitizeText(eventName, "Event Name"), contentX, currentY, {
        width: contentW,
        align: "center",
      });

    const detailsTop = currentY + 38;
    const detailsX = panelX + 42;
    const detailsW = panelW - 84;
    const detailsH = 128;

    doc.roundedRect(detailsX, detailsTop, detailsW, detailsH, 10)
      .lineWidth(1)
      .fillAndStroke(colors.white, colors.softBlush);

    const detailsCenterX = detailsX + detailsW / 2;

    doc.moveTo(detailsCenterX, detailsTop + 14)
      .lineTo(detailsCenterX, detailsTop + detailsH - 14)
      .lineWidth(1)
      .stroke(colors.pastelGreen);

    const detailsPadding = 16;
    const labelWidth = 72;
    const columnWidth = detailsW / 2 - detailsPadding * 2;

    const leftColumnX = detailsX + detailsPadding;
    const rightColumnX = detailsCenterX + detailsPadding;

    const leftLabelX = leftColumnX;
    const leftValueX = leftColumnX + labelWidth;
    const leftValueWidth = columnWidth - labelWidth;

    const rightLabelX = rightColumnX;
    const rightValueX = rightColumnX + labelWidth;
    const rightValueWidth = columnWidth - labelWidth;

    const row1Y = detailsTop + 18;
    const row2Y = detailsTop + 52;
    const row3Y = detailsTop + 86;

    doc.fillColor(colors.deepSlate)
      .font("Helvetica-Bold")
      .fontSize(10.8)
      .text("Date", leftLabelX, row1Y, { width: labelWidth, lineBreak: false })
      .text("Time", leftLabelX, row2Y, { width: labelWidth, lineBreak: false })
      .text("Venue", leftLabelX, row3Y, { width: labelWidth, lineBreak: false })
      .text("Cert ID", rightLabelX, row1Y, { width: labelWidth, lineBreak: false })
      .text("Issued", rightLabelX, row2Y, { width: labelWidth, lineBreak: false })
      .text("Issuer", rightLabelX, row3Y, { width: labelWidth, lineBreak: false });

    drawFittedValue({
      doc,
      value: eventDate,
      x: leftValueX,
      y: row1Y,
      width: leftValueWidth,
      color: colors.deepSlate,
    });

    drawFittedValue({
      doc,
      value: eventTime,
      x: leftValueX,
      y: row2Y,
      width: leftValueWidth,
      color: colors.deepSlate,
    });

    drawFittedValue({
      doc,
      value: eventVenue,
      x: leftValueX,
      y: row3Y,
      width: leftValueWidth,
      color: colors.deepSlate,
    });

    drawFittedValue({
      doc,
      value: formatCertificateIdForDisplay(certificateId),
      x: rightValueX,
      y: row1Y,
      width: rightValueWidth,
      color: colors.deepSlate,
    });

    drawFittedValue({
      doc,
      value: issueDate,
      x: rightValueX,
      y: row2Y,
      width: rightValueWidth,
      color: colors.deepSlate,
    });

    drawFittedValue({
      doc,
      value: formatOrganizerForDisplay(organizer),
      x: rightValueX,
      y: row3Y,
      width: rightValueWidth,
      color: colors.deepSlate,
    });

    const signatureLineY = panelY + panelH - 176;
    const leftSignatureX = panelX + 28;
    const leftSignatureWidth = 184;
    const rightSignatureX = panelX + panelW - 212;
    const rightSignatureWidth = 184;

    // Left signature (lavender) above Organizer block
    drawRandomSignature({
      doc,
      x: leftSignatureX,
      y: signatureLineY - 44,
      width: leftSignatureWidth,
      fallbackName: organizer,
      colors,
      inkPalette: [colors.lavender],
    });

    // Right signature (coral/orange) above Authorized Signature block
    drawRandomSignature({
      doc,
      x: rightSignatureX,
      y: signatureLineY - 44,
      width: rightSignatureWidth,
      fallbackName: signatureName,
      colors,
      inkPalette: [colors.coral],
    });

    drawSignatureBlock({
      doc,
      x: leftSignatureX,
      width: leftSignatureWidth,
      lineY: signatureLineY,
      name: organizer,
      role: "Organizer",
    });

    drawSignatureBlock({
      doc,
      x: rightSignatureX,
      width: rightSignatureWidth,
      lineY: signatureLineY,
      name: signatureName,
      role: signatureRole,
    });

    const bandY = panelY + panelH - 108;

    doc.rect(panelX + 1, bandY, panelW - 2, 98).fill(colors.deepSlate);
    doc.moveTo(panelX + 1, bandY)
      .lineTo(panelX + panelW - 1, bandY)
      .lineWidth(2)
      .stroke(colors.lavender);

    doc.moveTo(panelX + 16, bandY + 8)
      .bezierCurveTo(panelX + 116, bandY + 34, panelX + 104, bandY + 82, panelX + 188, bandY + 96)
      .lineWidth(4)
      .stroke(colors.coral);

    doc.moveTo(panelX + panelW - 16, bandY + 8)
      .bezierCurveTo(panelX + panelW - 116, bandY + 34, panelX + panelW - 104, bandY + 82, panelX + panelW - 188, bandY + 96)
      .lineWidth(4)
      .stroke(colors.coral);

    const sealX = pageWidth / 2;
    const sealY = bandY + 45;

    doc.circle(sealX, sealY, 23).fill(colors.white);
    doc.circle(sealX, sealY, 23).lineWidth(1.5).stroke(colors.lavender);

    if (hasLogo) {
      doc.image(EVENTSPHERE_LOGO_PATH, sealX - 14, sealY - 14, {
        fit: [28, 28],
        align: "center",
        valign: "center",
      });
    } else {
      doc.fillColor(colors.deepSlate)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("ES", sealX - 8, sealY - 4);
    }

    doc.fillColor(colors.white)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("EventSphere", contentX, bandY + 85, {
        width: contentW,
        align: "center",
      });

    doc.end();
  });
};

module.exports = {
  generateCertificate,
};
