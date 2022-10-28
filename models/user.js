const db = require('mongoose');
const validator = require('validator');

const userSchema = new db.Schema({
  name: {
    type: String,
    default: 'Имя не задано',
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: ({ value }) => `${value} - некорректный адрес email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });

module.exports = db.model('user', userSchema);
