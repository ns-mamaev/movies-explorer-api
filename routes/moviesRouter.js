const router = require('express').Router();

router.get('/', getSavedMovies);
router.post('/', createMovie);
router.delete('/:id', removeMovie);

module.exports = router;
