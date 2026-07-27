const mongoose = require('mongoose');
const { DIFFICULTY_LEVELS, QUESTION_CATEGORIES } = require('../config/constants');

const questionBankSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: QUESTION_CATEGORIES,
      default: 'General',
      index: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
      index: true,
    },
    company: { type: String, trim: true, default: '' }, // optional: company-tagged questions
    tags: { type: [String], default: [] },
    idealAnswerNotes: { type: String, default: '' }, // optional hints, not shown by default
  },
  { timestamps: true }
);

// Supports the search bar (question text) alongside category/difficulty filters.
questionBankSchema.index({ questionText: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionBankSchema);
