const router = require('express').Router();
const {
  getMovies,
  createMovie,
  removeMovieFromSaved,
  getRandomMovie,
  getMovie,
} = require('../controllers/moviesControllers');
const { validateMovieData, validateMovieId } = require('../validators/moviesValidators');

router.get('/', getMovies);
router.get('/random', getRandomMovie);
router.get('/:id', getMovie);
router.post('/', validateMovieData, createMovie);
router.delete('/:id', validateMovieId, removeMovieFromSaved);

module.exports = router;
