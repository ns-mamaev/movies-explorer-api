const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { JWT_SECRET } = require('../server.config');
const { AUTH_REQUIRED_MESSAGE } = require('../utills/constants');

module.exports = (req, _, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError(AUTH_REQUIRED_MESSAGE);
  }
  let payload;
  try {
    const secretKey = JWT_SECRET;
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError(AUTH_REQUIRED_MESSAGE);
  }
  req.user = payload;
  next();
};
