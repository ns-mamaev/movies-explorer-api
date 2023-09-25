const router = require('express').Router();
const { login, register, logout } = require('../controllers/usersController');
const NotFoundError = require('../errors/notFoundError');
const moviesRouter = require('./moviesRouter');
const genresRouter = require('./genresRouter');
const usersRouter = require('./usersRouter');
const auth = require('../middlewares/auth');
const { validateLoginData, validateRegisterData } = require('../validators/userValidators');

router.get('/crash', () => {
  throw new Error('Я УПАЛ!');
});

router.post('/signin', validateLoginData, login);
router.post('/signup', validateRegisterData, register);

// router.use(auth); // защита роутов авторизацией

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('/genres', genresRouter);
router.get('/signout', logout);

router.use(() => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
