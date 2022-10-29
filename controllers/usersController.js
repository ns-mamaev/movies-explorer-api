const bcrypt = require('bcrypt');
const User = require('../models/user');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');

const login = () => { console.log('Login')};

const logout = () => {};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash });
    res.status(201);
    res.send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError(err.messge));
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
