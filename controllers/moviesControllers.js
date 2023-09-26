const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Movie = require('../models/movie');
const {
  DOUBLE_FILM_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  INCORRECT_ID_MESSAGE,
  SUCCESS_REMOVE_FILM_MESSAGE,
  REMOVE_NOT_OWN_FILM_MESSAGE,
  RUSSIAN_MOVIES_CONDITION,
  MIN_MOOD_SCORE,
} = require('../utills/constants');
const Genre = require('../models/genre');

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

const getMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((films) => res.send({
      data: films,
    }))
    .catch(next);
};

const getRandomMovie = (req, res, next) => {
  const { query } = req;
  const conditions = [];
  // фильтр по стране
  if (query.country) {
    let operator = '$in';
    if (query.country === 'foreign') {
      operator = '$nin';
    }
    conditions.push({ country: { [operator]: RUSSIAN_MOVIES_CONDITION } });
  }
  // фильтр по дате
  if (query.year) {
    let startYear = 0;
    if (query.year === 'new') {
      startYear = new Date().getFullYear() - 1;
    }
    const matchLastRegexp = query.year.match(/last\d+/);
    if (matchLastRegexp) {
      startYear = new Date().getFullYear() - Number(query.year.replace('last', ''));
    }
    conditions.push({ year: { $gte: startYear } });
  }
  // фильтр по рейтингу
  if (query.rating) {
    if (query.rating === 'hight') {
      conditions.push({ ratingKP: { $gte: 7.5 } });
    }
    if (query.rating === 'top250') {
      conditions.push({ top250: { $ne: null } });
    }
  }
  // отбор жанров по настроению
  conditions.push({ [`mood.${query.mood}`]: { $gte: MIN_MOOD_SCORE } });

  Movie
    .aggregate([
      {
        $match: {
          $and: conditions,
        },
      },
      { $sample: { size: 1 } },
    ])
    .then((result) => {
      res.send({ data: result[0] || null });
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
  getMovie,
  getRandomMovie,
  createMovie,
  removeMovieFromSaved,
};
