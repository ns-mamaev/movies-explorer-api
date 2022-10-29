const router = require('express').Router();
const { getSavedMovies, createMovie, removeMovieFromSaved } = require('../controllers/moviesControllers');

router.get('/', getSavedMovies);
router.post('/', createMovie);
router.delete('/:id', removeMovieFromSaved);

module.exports = router;
