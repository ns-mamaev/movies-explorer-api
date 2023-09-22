const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const { Movie, Genre } = require('../models/movie');
const {
  DOUBLE_FILM_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  INCORRECT_ID_MESSAGE,
  SUCCESS_REMOVE_FILM_MESSAGE,
  REMOVE_NOT_OWN_FILM_MESSAGE,
} = require('../utills/constants');

const getMovies = (req, res, next) => {
  const {
    limit = 10,
    page = 0,
  } = req.query;
  const offset = page * limit;
  Movie.find()
    .skip(offset)
    .limit(limit)
    .then((films) => res.send({
      data: films,
    }))
    .catch(next);
};

const getRandomMovie = (req, res, next) => {
  Movie
    .aggregate([
      { $match: { ratingKP: { $gt: 7 } } },
      { $sample: { size: 1 } },
    ])
    .then((result) => {
      res.send({ data: result[0] });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.findOne({
    movieId: req.body.movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError(DOUBLE_FILM_MESSAGE);
      }
      return Movie.create({ ...req.body, owner: req.user._id })
        .then((newMovie) => res.status(201).send(newMovie));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const removeMovieFromSaved = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND_MESSAGE);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(REMOVE_NOT_OWN_FILM_MESSAGE);
      }
      return movie.delete()
        .then(() => res.send({ message: SUCCESS_REMOVE_FILM_MESSAGE }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(INCORRECT_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  getRandomMovie,
  createMovie,
  removeMovieFromSaved,
};
