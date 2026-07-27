// AppError distinguishes "operational" errors (bad input, auth failure, not found)
// from programmer errors/bugs. The global error handler uses `isOperational`
// to decide whether to expose the message to the client or hide it.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
