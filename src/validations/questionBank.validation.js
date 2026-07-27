const Joi = require('joi');
const { DIFFICULTY_LEVELS, QUESTION_CATEGORIES } = require('../config/constants');

const listQuestionsQuerySchema = Joi.object({
  category: Joi.string()
    .valid(...QUESTION_CATEGORIES)
    .optional(),
  difficulty: Joi.string()
    .valid(...DIFFICULTY_LEVELS)
    .optional(),
  search: Joi.string().trim().max(200).allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { listQuestionsQuerySchema };
