const { GoogleGenAI } = require("@google/genai");

/**
 * Generates a 3-line enthusiastic social-media-style summary of feedback comments.
 * Falls back to a generic positive blurb using the event title when there are no comments.
 *
 * @param {string} commentsText  - All feedback comments joined by newlines (may be empty)
 * @param {string} eventName     - Name of the event, used in fallback
 * @returns {Promise<string>}    - Summary text (always resolves, never throws)
 */
const generateFeedbackSummary = async (commentsText = "", eventName = "this event") => {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackSummary(eventName);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let prompt;

    if (commentsText.trim()) {
      prompt = `You are writing a short event recap for a college event management platform.

Here are the attendee feedback comments for the event "${eventName}":
${commentsText}

Write exactly 3 short sentences that sound enthusiastic and social-media-friendly.
Highlight what attendees enjoyed and capture the energy of the event.
Do not use emojis.
Do not use headings or bullet points.
Write in third person (e.g., "Attendees loved...", "The event was...").
Keep each sentence under 25 words.`;
    } else {
      prompt = `You are writing a short event recap for a college event management platform.

The event "${eventName}" has concluded but no written feedback comments were left.
Write exactly 3 short sentences that sound enthusiastic and social-media-friendly, based only on the event name.
Do not use emojis.
Do not use headings or bullet points.
Write in third person.
Keep each sentence under 25 words.`;
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const text = typeof result?.text === "function" ? result.text() : result?.text;
    const trimmed = (text || "").trim();

    return trimmed || fallbackSummary(eventName);
  } catch (err) {
    console.error("[aiSummary] generateFeedbackSummary error:", err.message);
    return fallbackSummary(eventName);
  }
};

/**
 * Generates a formal 2-paragraph execution description for an event report.
 * Falls back to deterministic text and always resolves.
 *
 * @param {Object} event
 * @returns {Promise<string>}
 */
const generateExecutionText = async (event = {}) => {
  const eventName = event?.eventName || "this event";
  const venue = event?.venue || "the designated venue";
  const category = event?.category || "college event";

  if (!process.env.GEMINI_API_KEY) {
    return fallbackExecutionText(eventName, venue, category);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Write a report description for an event.

Event name: ${eventName}
Venue: ${venue}
Category: ${category}

Write in 2 paragraphs.
Use a formal tone.
Use medium length.
Explain how the event was conducted and how it was executed.
Include the event name, venue, and category naturally in the response.
Do not use bullet points.
Do not use emojis.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const text = typeof result?.text === "function" ? result.text() : result?.text;
    const trimmed = (text || "").trim();

    return trimmed || fallbackExecutionText(eventName, venue, category);
  } catch (err) {
    console.error("[aiSummary] generateExecutionText error:", err.message);
    return fallbackExecutionText(eventName, venue, category);
  }
};

const fallbackSummary = (eventName) =>
  `${eventName} wrapped up to great enthusiasm from attendees. ` +
  `Participants left with new insights and memorable experiences. ` +
  `We look forward to seeing everyone at the next event!`;

const fallbackExecutionText = (eventName, venue, category) =>
  `${eventName} was conducted at ${venue} as a structured ${category.toLowerCase()} activity with clear planning and coordinated facilitation. ` +
  `The program followed a formal flow from opening orientation to core sessions, ensuring participants remained informed, engaged, and aligned with the event objectives.\n\n` +
  `Execution was managed through timely coordination of logistics, participant guidance, and session transitions, which supported smooth delivery throughout the schedule. ` +
  `The event concluded in an organized manner with all planned components completed effectively and with professional standards maintained at each stage.`;

module.exports = { generateFeedbackSummary, generateExecutionText };
