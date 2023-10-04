const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Movie = require('../models/movie');
const SavedMovie = require('../models/savedMovie');
const {
  DOUBLE_FILM_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  INCORRECT_ID_MESSAGE,
  SUCCESS_REMOVE_FILM_MESSAGE,
  REMOVE_NOT_OWN_FILM_MESSAGE,
  RUSSIAN_MOVIES_CONDITION,
  MIN_MOOD_SCORE,
  SORT_OPTIONS,
  RAITING_OPTIONS,
  YEAR_OPTIONS,
} = require('../utills/constants');

const getMovies = (req, res, next) => {
  const {
    sortType,
    rating,
    years,
    genres,
    search,
  } = req.query;

  const offset = Number(req.query.offset || 0);
  const limit = Number(req.query.limit || 12);

  const sortArg = SORT_OPTIONS[sortType] || SORT_OPTIONS.yearDesk;

  const whereConditions = [];

  if (search) {
    whereConditions.push({ nameRU: new RegExp(`${search}`, 'i')});
  }

  if (rating && Object.hasOwn(RAITING_OPTIONS, rating)) {
    whereConditions.push(RAITING_OPTIONS[rating]);
  }

  if (genres) {
    const genresList = genres.split(';').map((v) => Number(v));
    whereConditions.push({ genres: { $elemMatch: { $in: genresList } } });
  }

  if (years) {
    const yearsList = years.split(';');
    if (yearsList.length === 1) {
      whereConditions.push(YEAR_OPTIONS[yearsList[0]]);
    } else {
      const yearsConditions = [];
      yearsList.forEach((option) => {
        const condition = YEAR_OPTIONS[option];
        if (condition) {
          yearsConditions.push(condition);
        }
      });
      whereConditions.push({ $or: yearsConditions });
    }
  }

  const pipeline = [
    {
      $match: whereConditions.length ? { $and: whereConditions } : {},
    },
    {
      $facet: {
        totalCount: [
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        documents: [
          { $sort: sortArg },
          { $skip: offset },
          { $limit: limit },
          {
            $lookup: {
              from: 'saved-movies',
              localField: '_id',
              foreignField: 'movieId',
              pipeline: [{ $match: { owner: ObjectId(req.user?._id) } }],
              as: 'savedData',
            },
          },
        ],
      },
    },
  ];

  Movie.aggregate(pipeline)
    .then((result) => {
      const { totalCount, documents } = result[0];
      if (!totalCount[0]) {
        return res.send({ data: null });
      }
      const { count } = totalCount[0];
      return res.send({
        data: {
          totalCount: count,
          offset: Math.min(offset + limit),
          movies: documents,
        },
      });
    })
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

const getSavedMovies = (req, res, next) => {
  SavedMovie
    // .find({ owner: req.user._id })
    .aggregate([
      { $match: { owner: ObjectId(req.user._id) } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movieData',
        },
      },
      { $unwind: '$movieData' },
    ])
    .then((result) => res.send({ data: result }))
    .catch(next);
};

const saveMovie = (req, res, next) => {
  // TODO придумать как решить задачу одним запросом
  SavedMovie.findOne({
    movieId: req.params.id,
    owner: req.user._id,
  })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError(DOUBLE_FILM_MESSAGE);
      }
      return SavedMovie.create({ movieId: req.params.id, owner: req.user._id })
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
  SavedMovie.findOne({
    movieId: req.body._id,
    owner: req.user._id,
  })
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
  getSavedMovies,
  saveMovie,
  removeMovieFromSaved,
};
