const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const {
  LOGOUT_MESSAGE,
  DOUBLE_EMAIL_MESSAGE,
} = require('../utills/constants');
const { COOKIE_MAX_AGE, JWT_SECRET } = require('../server.config');

const createTokenById = (id) => jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: '7d' });

const sendTokenCookie = (res, user) => {
  const { _id } = user;
  const token = createTokenById(_id);
  return res
    .cookie('token', token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: true,
    })
    .send(user);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      sendTokenCookie(res, user);
    })
    .catch(next);
};

const logout = (_, res) => {
  res.clearCookie('token').send({ message: LOGOUT_MESSAGE });
};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash });
    res.status(201).send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(DOUBLE_EMAIL_MESSAGE));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

const getOwnProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateOwnProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const doubleUser = await User.findOne({ email });
    // если _id не равны - значит попытка использовать email занятый другим пользователем
    if (doubleUser?._id !== req.user._id) {
      throw new ConflictError(DOUBLE_EMAIL_MESSAGE);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports = {
  login,
  logout,
  register,
  getOwnProfile,
  updateOwnProfile,
};
