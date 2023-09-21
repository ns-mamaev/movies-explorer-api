const router = require('express').Router();
const { getMovies, createMovie, removeMovieFromSaved } = require('../controllers/moviesControllers');
const { validateMovieData, validateMovieId } = require('../validators/moviesValidators');

router.get('/', getMovies);
router.post('/', validateMovieData, createMovie);
router.delete('/:id', validateMovieId, removeMovieFromSaved);

module.exports = router;
