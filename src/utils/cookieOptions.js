const env = require('../config/env');
const { durationToMs } = require('./tokenUtils');

/**
 * Centralizes cookie flags so access/refresh cookies are always set
 * consistently (httpOnly, sameSite, secure).
 *
 * SameSite=Lax works on localhost where frontend and backend share the
 * same site, but breaks once they're deployed to different domains (e.g.
 * frontend on Amplify, backend on Render) — cross-site fetch/XHR requests
 * won't carry a Lax cookie at all, so login would appear to succeed but the
 * session wouldn't persist. SameSite=None fixes that, but browsers require
 * Secure=true (HTTPS) whenever SameSite=None is used, so the two are tied
 * together here rather than configured independently.
 */
const crossSiteCookies = env.cookieSecure;

function getAccessTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: crossSiteCookies ? 'none' : 'lax',
    maxAge: durationToMs(env.jwt.accessExpiresIn),
  };
}

function getRefreshTokenCookieOptions(rememberMe = true) {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: crossSiteCookies ? 'none' : 'lax',
    // "Remember me" unchecked -> session cookie (no maxAge) so it clears
    // when the browser closes; checked -> persists for the full expiry.
    ...(rememberMe ? { maxAge: durationToMs(env.jwt.refreshExpiresIn) } : {}),
  };
}

module.exports = { getAccessTokenCookieOptions, getRefreshTokenCookieOptions };