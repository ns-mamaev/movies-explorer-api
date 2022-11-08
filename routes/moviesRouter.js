const router = require('express').Router();
const { getSavedMovies, createMovie, removeMovieFromSaved } = require('../controllers/moviesControllers');
const { validateMovieData, validateMovieId } = require('../validators/moviesValidators');

router.get('/', getSavedMovies);
router.post('/', validateMovieData, createMovie);
router.delete('/:id', validateMovieId, removeMovieFromSaved);

module.exports = router;
