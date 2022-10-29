const router = require('express').Router();
const moviesRouter = require('./moviesRouter');
const usersRouter = require('./usersRouter');

router.get('/crash', () => {
  throw new Error('Я УПАЛ!');
});

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
