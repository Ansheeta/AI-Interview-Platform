const Joi = require('joi');
const { DIFFICULTY_LEVELS } = require('../config/constants');

const startInterviewSchema = Joi.object({
  company: Joi.string().trim().min(2).max(100).required(),
  role: Joi.string().trim().min(2).max(100).required(),
  difficulty: Joi.string()
    .valid(...DIFFICULTY_LEVELS)
    .required(),
  numberOfQuestions: Joi.number().integer().min(3).max(10).default(5),
});

const submitAnswerSchema = Joi.object({
  questionIndex: Joi.number().integer().min(0).required(),
  answerText: Joi.string().allow('').max(5000).required(),
  timeTakenSeconds: Joi.number().integer().min(0).default(0),
});

const submitInterviewSchema = Joi.object({
  answers: Joi.array().items(submitAnswerSchema).min(1).required(),
});

module.exports = {
  startInterviewSchema,
  submitInterviewSchema,
};
