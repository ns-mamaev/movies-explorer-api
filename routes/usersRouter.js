const router = require('express').Router();

router.get('/me', getOwnProfile);
router.patch('/me', updateOwnProfile); // точно только свой профиль или нужно сделать функцию универсальной?

module.exports = router;
