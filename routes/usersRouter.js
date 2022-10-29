const router = require('express').Router();
const { getOwnProfile, updateOwnProfile } = require('../controllers/usersController');

router.get('/me', getOwnProfile);
router.patch('/me', updateOwnProfile); // точно только свой профиль или нужно сделать функцию универсальной?

module.exports = router;
