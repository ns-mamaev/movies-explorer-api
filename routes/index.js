const router = require('express').Router();
const { login, register, logout } = require('../controllers/usersController');
const NotFoundError = require('../errors/notFoundError');
const moviesRouter = require('./moviesRouter');
const genresRouter = require('./genresRouter');
const usersRouter = require('./usersRouter');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateLoginData, validateRegisterData } = require('../validators/userValidators');

router.get('/crash', () => {
  throw new Error('Я УПАЛ!');
});

router.post('/signin', validateLoginData, login);
router.post('/signup', validateRegisterData, register);
// роуты ниже работают с req.user, который добавляет эта миддлвара
router.use(authMiddleware);
router.get('/signout', logout);
router.use('/movies', moviesRouter);
router.use('/users', usersRouter);
router.use('/genres', genresRouter);

router.use(() => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
