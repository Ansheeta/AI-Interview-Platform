const mongoose = require('mongoose');
const { DIFFICULTY_LEVELS, INTERVIEW_STATUS } = require('../config/constants');

const questionSubSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    category: { type: String, default: 'General' },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const answerSubSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    answerText: { type: String, default: '' },
    timeTakenSeconds: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100, default: null },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
    },
    questions: {
      type: [questionSubSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    answers: {
      type: [answerSubSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(INTERVIEW_STATUS),
      default: INTERVIEW_STATUS.IN_PROGRESS,
    },
    overallScore: { type: Number, min: 0, max: 100, default: null },
    overallFeedback: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Speeds up history queries filtered/sorted by user + recency.
interviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
