const router = require('express').Router();
const { getOwnProfile, updateOwnProfile } = require('../controllers/usersController');

router.get('/me', getOwnProfile);
router.patch('/me', updateOwnProfile);

module.exports = router;
