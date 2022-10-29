const db = require('mongoose');
const validator = require('validator');

const urlValidator = {
  validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
  message: ({ value }) => `${value} - некоректный адрес URL. Ожидается адрес в формате: http(s)://(www.)site.com`,
};

const movieSchema = new db.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: urlValidator,
  },
  trailerLink: {
    type: String,
    require: true,
    validate: urlValidator,
  },
  thumbnail: {
    type: String,
    require: true,
    validate: urlValidator,
  },
  owner: {
    type: db.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: db.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = db.model('movie', movieSchema);
