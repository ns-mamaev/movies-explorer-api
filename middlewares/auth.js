const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { getJWTSecretKey } = require('../utills/utills');

module.exports = (req, _, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация для доступа к запрашиваемому ресурсу');
  }
  let payload;
  try {
    const secretKey = getJWTSecretKey();
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация для доступа к запрашиваемому ресурсу');
  }
  req.user = payload;
  next();
};
