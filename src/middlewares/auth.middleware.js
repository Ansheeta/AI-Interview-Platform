const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { verifyAccessToken } = require('../utils/tokenUtils');
const { COOKIE_NAMES, USER_ROLES } = require('../config/constants');
const User = require('../models/User.model');

/**
 * Protects a route: requires a valid access token (from cookie or
 * Authorization header) and attaches the authenticated user to req.user.
 */
const protect = catchAsync(async (req, res, next) => {
  let token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401));
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired session. Please log in again.', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to specific roles. Must be used after `protect`.
 * Usage: restrictTo(USER_ROLES.ADMIN)
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

module.exports = { protect, restrictTo, USER_ROLES };
