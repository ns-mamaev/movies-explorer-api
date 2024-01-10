const router = require('express').Router();
const authCheck = require('../middlewares/authCheck');
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
router.get('/saved', authCheck, getSavedMovies);
router.get('/:id', getMovie);
router.post('/:id/likes', authCheck, saveMovie);
router.delete('/:id/likes', authCheck, removeMovieFromSaved);

module.exports = router;
