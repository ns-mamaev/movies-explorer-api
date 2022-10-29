const router = require('express').Router();
const { getSavedMovies, createMovie, removeMovie } = require('../controllers/moviesControllers');

router.get('/', getSavedMovies);
router.post('/', createMovie);
router.delete('/:id', removeMovie);

module.exports = router;
