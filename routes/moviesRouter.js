const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  getMovies,
  removeMovieFromSaved,
  getRandomMovie,
  getMovie,
  saveMovie,
} = require('../controllers/moviesControllers');
const { validateMovieData, validateMovieId } = require('../validators/moviesValidators');

router.get('/', getMovies);
router.get('/random', getRandomMovie);
router.get('/:id', getMovie);
router.use(authMiddleware);
router.post('/', saveMovie);
router.delete('/:id', validateMovieId, removeMovieFromSaved);

module.exports = router;
