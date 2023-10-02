const router = require('express').Router();
const { getOwnProfile, updateOwnProfile } = require('../controllers/usersController');
const { validateUserProfile } = require('../validators/userValidators');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/me', getOwnProfile);
router.patch('/me', validateUserProfile, updateOwnProfile);

module.exports = router;
