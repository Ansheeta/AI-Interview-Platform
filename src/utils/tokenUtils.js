const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generates a short-lived access token carrying only the user id.
 * Kept minimal so the payload never leaks stale profile data.
 */
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

/**
 * Generates a long-lived refresh token. A separate secret is used so that
 * compromising one token type doesn't let an attacker forge the other.
 */
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

/**
 * Converts durations like "15m" / "7d" into milliseconds for cookie maxAge.
 * Supports s (seconds), m (minutes), h (hours), d (days).
 */
function durationToMs(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 15 * 60 * 1000; // sensible fallback: 15 minutes

  const value = Number(match[1]);
  const unit = match[2];
  const unitToMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitToMs[unit];
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  durationToMs,
};
