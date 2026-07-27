const Interview = require('../models/Interview.model');
const AppError = require('../utils/AppError');
const { INTERVIEW_STATUS, DEFAULT_QUESTION_COUNT } = require('../config/constants');
const geminiService = require('./gemini.service');

async function startInterview(userId, { company, role, difficulty, numberOfQuestions }) {
  const count = numberOfQuestions || DEFAULT_QUESTION_COUNT;

  const generatedQuestions = await geminiService.generateInterviewQuestions({
    company,
    role,
    difficulty,
    count,
  });

  const interview = await Interview.create({
    user: userId,
    company,
    role,
    difficulty,
    questions: generatedQuestions,
    status: INTERVIEW_STATUS.IN_PROGRESS,
  });

  return interview;
}

async function getInterviewById(userId, interviewId) {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) {
    throw new AppError('Interview not found.', 404);
  }
  return interview;
}

/**
 * Submits all answers for an in-progress interview, sends the full
 * question/answer set to Gemini for evaluation in one call, then persists
 * the scored result.
 */
async function submitInterview(userId, interviewId, { answers }) {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) {
    throw new AppError('Interview not found.', 404);
  }
  if (interview.status === INTERVIEW_STATUS.COMPLETED) {
    throw new AppError('This interview has already been completed.', 409);
  }

  const evaluation = await geminiService.evaluateInterview({
    company: interview.company,
    role: interview.role,
    difficulty: interview.difficulty,
    questions: interview.questions,
    answers,
  });

  // Merge submitted answers with the AI's per-question scoring.
  interview.answers = answers.map((a) => {
    const perQ = evaluation.perQuestion.find((p) => p.questionIndex === a.questionIndex);
    return {
      questionIndex: a.questionIndex,
      answerText: a.answerText,
      timeTakenSeconds: a.timeTakenSeconds || 0,
      score: perQ?.score ?? null,
      feedback: perQ?.feedback || '',
    };
  });

  interview.overallScore = evaluation.overallScore;
  interview.overallFeedback = evaluation.overallFeedback;
  interview.strengths = evaluation.strengths || [];
  interview.improvements = evaluation.improvements || [];
  interview.status = INTERVIEW_STATUS.COMPLETED;
  interview.completedAt = new Date();

  await interview.save();
  return interview;
}

async function abandonInterview(userId, interviewId) {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) {
    throw new AppError('Interview not found.', 404);
  }
  if (interview.status === INTERVIEW_STATUS.IN_PROGRESS) {
    interview.status = INTERVIEW_STATUS.ABANDONED;
    await interview.save();
  }
  return interview;
}

/**
 * Paginated, filterable interview history for the "Interview History" page.
 */
async function getInterviewHistory(userId, { page, limit, search, status }) {
  const query = { user: userId };
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Interview.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Interview.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

module.exports = {
  startInterview,
  getInterviewById,
  submitInterview,
  abandonInterview,
  getInterviewHistory,
};
