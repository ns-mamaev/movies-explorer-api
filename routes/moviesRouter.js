const router = require('express').Router();
const {
  getMovies,
  createMovie,
  removeMovieFromSaved,
  getRandomMovie,
} = require('../controllers/moviesControllers');
const { validateMovieData, validateMovieId } = require('../validators/moviesValidators');

router.get('/', getMovies);
router.post('/', validateMovieData, createMovie);
router.get('/random', getRandomMovie);
router.delete('/:id', validateMovieId, removeMovieFromSaved);

module.exports = router;
