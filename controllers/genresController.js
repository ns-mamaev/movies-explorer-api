const Genre = require('../models/genre');

const getGenres = (req, res, next) => {
  Genre.find()
    .then((genres) => res.send({
      data: genres,
    }))
    .catch(next);
};

module.exports = {
  getGenres,
};
