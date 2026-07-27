const env = require('../config/env');

/**
 * Translates known Mongoose/JWT error types into consistent AppError-shaped
 * responses so the client always receives a predictable error format.
 */
function handleKnownErrors(err) {
  let error = { ...err, message: err.message };

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    error = { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = { statusCode: 409, message: `${field} already in use. Please use another.` };
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = { statusCode: 400, message };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { statusCode: 401, message: 'Invalid token. Please log in again.' };
  }
  if (err.name === 'TokenExpiredError') {
    error = { statusCode: 401, message: 'Your session has expired. Please log in again.' };
  }

  return error;
}

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const processed = handleKnownErrors(err);
  const statusCode = processed.statusCode || err.statusCode || 500;
  const isOperational = err.isOperational || !!processed.statusCode;

  const message = isOperational
    ? processed.message || err.message
    : 'Something went wrong on our end. Please try again later.';

  if (env.nodeEnv === 'development' && !isOperational) {
    // eslint-disable-next-line no-console
    console.error('UNEXPECTED ERROR 💥', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};
