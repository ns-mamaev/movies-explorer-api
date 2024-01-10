const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { JWT_SECRET } = require('../server.config');
const { AUTH_REQUIRED_MESSAGE } = require('../utills/constants');

module.exports = (req, _, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    next(new UnauthorizedError(AUTH_REQUIRED_MESSAGE));
  }
  return next();
};
