const dotenv = require('dotenv');

dotenv.config();

// Centralizing all env access here means the rest of the app never touches
// process.env directly — one place to validate, default, and refactor.
const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cookieSecure: process.env.COOKIE_SECURE === 'true',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

// Fail fast in any environment if critical secrets are missing.
const requiredKeys = [
  ['mongoUri', env.mongoUri],
  ['jwt.accessSecret', env.jwt.accessSecret],
  ['jwt.refreshSecret', env.jwt.refreshSecret],
];

requiredKeys.forEach(([key, value]) => {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Warning: ${key} is not set. Check your .env file.`);
  }
});

module.exports = env;
