const db = require('mongoose');

const genreSchema = new db.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
});

const Genre = db.model('genre', genreSchema);

module.exports = Genre;
