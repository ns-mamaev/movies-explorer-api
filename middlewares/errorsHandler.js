const { INTERNAL_SERVER_ERROR_MESSAGE } = require('../utills/constants');

module.exports = (err, _, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? INTERNAL_SERVER_ERROR_MESSAGE : message,
    });
  next();
};
