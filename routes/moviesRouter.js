const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  getMovies,
  removeMovieFromSaved,
  getRandomMovie,
  getMovie,
  saveMovie,
  getSavedMovies,
} = require('../controllers/moviesControllers');

router.get('/', getMovies);
router.get('/random', getRandomMovie);
router.get('/saved', authMiddleware, getSavedMovies);
router.get('/:id', getMovie);
router.post('/:id/likes', authMiddleware, saveMovie);
router.delete('/:id', authMiddleware, removeMovieFromSaved);

module.exports = router;
