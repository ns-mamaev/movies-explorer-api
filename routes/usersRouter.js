const router = require('express').Router();
const { getOwnProfile, updateOwnProfile } = require('../controllers/usersController');
const { validateUserName } = require('../validators/userValidators');

router.get('/me', getOwnProfile);
router.patch('/me', validateUserName, updateOwnProfile);

module.exports = router;
