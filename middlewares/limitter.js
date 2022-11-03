require('dotenv').config();
const limitter = require('express-rate-limit');

const {
  REQUESTS_WINDOW_MS = 300000,
  MAX_REQUESTS_NUMBER = 100,
} = process.env;

module.exports = limitter({
  windowMs: REQUESTS_WINDOW_MS,
  max: MAX_REQUESTS_NUMBER,
});
