// Wraps async route handlers so any rejected promise is forwarded to next(),
// letting the centralized error middleware handle it instead of needing
// try/catch in every controller.
module.exports = function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
