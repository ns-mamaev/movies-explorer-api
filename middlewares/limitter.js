const limitter = require('express-rate-limit');
const { REQUESTS_WINDOW_MS, MAX_REQUESTS_NUMBER } = require('../server.config');

module.exports = limitter({
  windowMs: REQUESTS_WINDOW_MS,
  max: MAX_REQUESTS_NUMBER,
});
