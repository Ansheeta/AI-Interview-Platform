// Shared enums/constants used across models, validations, and controllers.
// Keeping these in one file avoids "magic string" drift between layers.

const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

const INTERVIEW_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const QUESTION_CATEGORIES = [
  'Data Structures & Algorithms',
  'System Design',
  'Behavioral',
  'Database',
  'Operating Systems',
  'Networking',
  'Frontend',
  'Backend',
  'OOP & Design Patterns',
  'General',
];

const DEFAULT_QUESTION_COUNT = 5;

module.exports = {
  COOKIE_NAMES,
  DIFFICULTY_LEVELS,
  INTERVIEW_STATUS,
  USER_ROLES,
  QUESTION_CATEGORIES,
  DEFAULT_QUESTION_COUNT,
};
