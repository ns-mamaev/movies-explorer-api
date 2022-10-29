const { Joi, celebrate } = require('celebrate');

const validateLoginData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegisterData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateUserName = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  validateLoginData,
  validateRegisterData,
  validateUserName,
};
