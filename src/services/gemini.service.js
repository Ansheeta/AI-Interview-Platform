const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const parseJsonFromAI = require('../utils/parseJsonFromAI');

// Lazily instantiated so importing this module never throws even if the
// API key isn't set yet (e.g. during early setup/dev without a key).
let genAI = null;
function getClient() {
  if (!env.gemini.apiKey) {
    throw new AppError('AI service is not configured. Missing Gemini API key.', 500);
  }
  if (!genAI) {
    // genAI = new GoogleGenerativeAI(env.gemini.apiKey);
     genAI = new GoogleGenerativeAI(env.gemini.apiKey, {
      apiHeader: {
        'x-goog-api-key': env.gemini.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }
  return genAI;
}

function getModel() {
  return getClient().getGenerativeModel({ model: 'gemini-2.5-flash' });
}

/**
 * Generates `count` interview questions for a given company/role/difficulty.
 * Returns an array of { questionText, category }.
 */

async function generateInterviewQuestions({ company, role, difficulty, count }) {
  const prompt = `You are an expert technical interviewer preparing mock interview questions.

Generate exactly ${count} interview questions for a candidate interviewing at "${company}" for the role of "${role}" at "${difficulty}" difficulty.

Mix question types appropriately for the role (technical, behavioral, and role-specific questions).

Respond with ONLY a raw JSON array, no markdown, no commentary, in this exact shape:
[
  { "questionText": "string", "category": "string (e.g. Data Structures & Algorithms, System Design, Behavioral, Frontend, Backend, General)" }
]`;

  let result;
  try {
    // 1. Explicitly await the remote network call to the Gemini model
    result = await getModel().generateContent(prompt);
  } catch (err) {
    console.error("Gemini Generation SDK Error:", err);
    throw new AppError('Failed to generate interview questions. Please try again.', 502);
  }

  // 2. CRUCIAL FIX: Await the response wrapper cleanly to keep the network stream open
  const response = await result.response;
  const text = response.text();
  
  // 3. Defer the heavy JSON parsing operation slightly to keep the event loop non-blocking
  const parsed = await new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        resolve(parseJsonFromAI(text));
      } catch (e) {
        reject(new AppError('AI returned an unexpected response format for questions.', 502));
      }
    });
  });

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new AppError('AI returned an empty or invalid format array.', 502);
  }

  return parsed.map((q, index) => ({
    questionText: q.questionText || `Question ${index + 1}`,
    category: q.category || 'General',
    order: index,
  }));
}

// async function generateInterviewQuestions({ company, role, difficulty, count }) {
//   const prompt = `You are an expert technical interviewer preparing mock interview questions.

// Generate exactly ${count} interview questions for a candidate interviewing at "${company}" for the role of "${role}" at "${difficulty}" difficulty.

// Mix question types appropriately for the role (technical, behavioral, and role-specific questions).

// Respond with ONLY a raw JSON array, no markdown, no commentary, in this exact shape:
// [
//   { "questionText": "string", "category": "string (e.g. Data Structures & Algorithms, System Design, Behavioral, Frontend, Backend, General)" }
// ]`;

//   let result;
//   try {
//     result = await getModel().generateContent(prompt);
//   } catch (err) {
//     throw new AppError('Failed to generate interview questions. Please try again.', 502);
//   }

//   const text = result.response.text();
//   const parsed = parseJsonFromAI(text);

//   if (!Array.isArray(parsed) || parsed.length === 0) {
//     throw new AppError('AI returned an unexpected response format for questions.', 502);
//   }

//   return parsed.map((q, index) => ({
//     questionText: q.questionText || `Question ${index + 1}`,
//     category: q.category || 'General',
//     order: index,
//   }));
// }

/**
 * Evaluates a full interview (all questions + candidate answers) in a
 * single call for efficiency and to let the AI give feedback aware of the
 * whole conversation, not just isolated answers.
 *
 * Returns:
 * {
 *   overallScore: number (0-100),
 *   overallFeedback: string,
 *   strengths: string[],
 *   improvements: string[],
 *   perQuestion: [{ questionIndex, score, feedback }]
 * }
 */
async function evaluateInterview({ company, role, difficulty, questions, answers }) {
  const qaPairs = questions
    .map((q, i) => {
      const answer = answers.find((a) => a.questionIndex === i);
      return `Q${i + 1} [${q.category}]: ${q.questionText}\nCandidate's Answer: ${
        answer?.answerText?.trim() || '(No answer provided)'
      }`;
    })
    .join('\n\n');

  const prompt = `You are an expert interview coach evaluating a mock interview.

Candidate interviewed for "${role}" at "${company}", difficulty: "${difficulty}".

Here are the questions and the candidate's answers:

${qaPairs}

Evaluate the candidate's performance. For each question give a score from 0-100 and short specific feedback. Then give an overall score (0-100, weighted average is fine), 2-4 sentence overall feedback, a list of strengths, and a list of concrete improvement suggestions.

Respond with ONLY raw JSON, no markdown, no commentary, in this exact shape:
{
  "overallScore": number,
  "overallFeedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "perQuestion": [
    { "questionIndex": number, "score": number, "feedback": "string" }
  ]
}`;

  let result;
  try {
    result = await getModel().generateContent(prompt);
  } catch (err) {
    throw new AppError('Failed to evaluate interview. Please try again.', 502);
  }

  const text = result.response.text();
  const parsed = parseJsonFromAI(text);

  if (typeof parsed.overallScore !== 'number' || !Array.isArray(parsed.perQuestion)) {
    throw new AppError('AI returned an unexpected response format for evaluation.', 502);
  }

  return parsed;
}

module.exports = { generateInterviewQuestions, evaluateInterview };
