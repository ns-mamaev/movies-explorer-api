const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Movie = require('../models/movie');

const getSavedMovies = (_, res, next) => {
  Movie.find({})
    .then((films) => res.send(films))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.findOne({ movieId })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError('Фильм с данным id уже добавлен в базу')
      }
      return Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user._id,
      })
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
        throw new NotFoundError('Фильм с таким id не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие фильмы');
      }
      return movie.delete()
        .then(() => res.send({ message: 'Фильм удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный формат id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getSavedMovies,
  createMovie,
  removeMovieFromSaved,
};
