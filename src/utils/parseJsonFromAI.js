const AppError = require('./AppError');

/**
 * Gemini often wraps JSON responses in ```json ... ``` fences, or adds
 * stray leading/trailing text despite instructions. This strips common
 * wrappers and parses defensively so one flaky AI response doesn't crash
 * the request — it surfaces as a clean 502 instead of an unhandled throw.
 */
function parseJsonFromAI(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new AppError('AI service returned an empty response.', 502);
  }

  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '');
  cleaned = cleaned.trim();

  // Fallback: extract the first {...} or [...] block if extra prose slipped in.
  const firstBrace = cleaned.search(/[[{]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new AppError('Failed to parse AI response. Please try again.', 502);
  }
}

module.exports = parseJsonFromAI;
