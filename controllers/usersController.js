require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { getJWTSecretKey } = require('../utills/utills');

const { COOKIE_MAX_AGE } = process.env;

const createTokenById = (id) => jwt.sign({ _id: id }, getJWTSecretKey(), { expiresIn: '7d' });

const sendTokenCookie = (res, newUser) => {
  const { _id } = newUser;
  const token = createTokenById(_id);
  return res
    .cookie('token', token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: false,
    })
    .send(newUser);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      sendTokenCookie(res, user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const logout = () => {};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash });
    res.status(201);
    sendTokenCookie(res, newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

const getOwnProfile = () => {};

const updateOwnProfile = () => {};

module.exports = {
  login,
  logout,
  register,
  getOwnProfile,
  updateOwnProfile,
};
