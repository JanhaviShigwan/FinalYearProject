const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const parseRetryAfterSeconds = (message) => {
  if (typeof message !== "string") return null;

  const retryInMatch = message.match(/retry in\s+([\d.]+)s/i);
  if (retryInMatch?.[1]) {
    return Math.max(1, Math.ceil(Number(retryInMatch[1])));
  }

  const retryDelayMatch = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (retryDelayMatch?.[1]) {
    return Number(retryDelayMatch[1]);
  }

  return null;
};

router.post("/generate-description", async (req, res) => {
  try {
    const eventName = (req.body?.eventName || "").trim();
    const shortDescription = (req.body?.shortDescription || "").trim();

    if (!eventName || !shortDescription) {
      return res.status(400).json({
        message: "eventName and shortDescription are required.",
      });
    }

    const prompt = `Generate a professional long description for a college event.

Event Name: ${eventName}
Short Description: ${shortDescription}

Write 2 to 3 paragraphs.
Make it formal.
Make it suitable for college event website.
Do not use emojis.
Do not add headings.
Do not add bullet points.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const responseText = typeof result?.text === "function" ? result.text() : result?.text;
    const description = responseText?.trim();

    if (!description) {
      return res.status(500).json({
        message: "Failed to generate description.",
      });
    }

    return res.json({ description });
  } catch (error) {
    console.error("AI description generation error:", error);

    const statusCode =
      Number(error?.status)
      || Number(error?.code)
      || Number(error?.statusCode)
      || Number(error?.response?.status);

    const messageText = typeof error?.message === "string" ? error.message : "";
    const isQuotaError =
      statusCode === 429
      || /RESOURCE_EXHAUSTED/i.test(messageText)
      || /quota exceeded/i.test(messageText);

    if (statusCode === 404 || /NOT_FOUND/i.test(messageText) || /is not found/i.test(messageText)) {
      return res.status(500).json({
        message: "AI model not available. Please contact the administrator.",
      });
    }

    if (isQuotaError) {
      const details =
        messageText
          ? messageText
          : "You exceeded Gemini API quota limits. Please check billing/quota and retry.";

      const retryAfterSeconds = parseRetryAfterSeconds(details);

      const response = {
        message: "AI quota exceeded. Please check Gemini plan/billing and try again.",
        details,
      };

      if (retryAfterSeconds) {
        response.retryAfterSeconds = retryAfterSeconds;
      }

      return res.status(429).json(response);
    }

    return res.status(500).json({
      message: "Unable to generate description.",
    });
  }
});

module.exports = router;
