const db = require('mongoose');

const savedMovie = new db.Schema({
  owner: {
    type: db.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: db.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
});

const SavedMovie = db.model('saved-movie', savedMovie);

module.exports = SavedMovie;
