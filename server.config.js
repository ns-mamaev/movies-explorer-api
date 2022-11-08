require('dotenv').config();

const {
  NODE_ENV,
  PORT = 3000,
  DB_PATH,
  REQUESTS_WINDOW_MS = 300000,
  MAX_REQUESTS_NUMBER = 100,
  COOKIE_MAX_AGE = 86400000,
  ALLOWED_CORS,
  JWT_SECRET,
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  DB_PATH: NODE_ENV === 'production' ? DB_PATH : 'mongodb://localhost:27017/moviesdb',
  REQUESTS_WINDOW_MS,
  MAX_REQUESTS_NUMBER,
  ALLOWED_CORS,
  COOKIE_MAX_AGE,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-code',
};
