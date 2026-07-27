const AppError = require('../utils/AppError');

/**
 * Returns an Express middleware that validates req.body against the given
 * Joi schema. Using a factory keeps route files declarative:
 *   router.post('/register', validate(registerSchema), authController.register)
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return next(new AppError(message, 400));
    }

    req.body = value;
    next();
  };
}

/**
 * Same as `validate`, but validates req.query instead of req.body — used
 * for list/search/filter endpoints (e.g. question bank, interview history).
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return next(new AppError(message, 400));
    }

    req.query = value;
    next();
  };
}

module.exports = validate;
module.exports.validateQuery = validateQuery;
