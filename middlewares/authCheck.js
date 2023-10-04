const UnauthorizedError = require('../errors/unauthorizedError');
const { AUTH_REQUIRED_MESSAGE } = require('../utills/constants');

module.exports = (req, _, next) => {
  if (!req.user) {
    next(new UnauthorizedError(AUTH_REQUIRED_MESSAGE));
  }
  next();
};
