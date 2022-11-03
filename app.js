require('dotenv').config();
const express = require('express');
const db = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors: validationErrorsHandler } = require('celebrate');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limitter = require('./middlewares/limitter');

const {
  PORT = 3000,
  NODE_ENV,
  DB_PATH,
} = process.env;

const app = express();
db.connect(NODE_ENV === 'production' ? DB_PATH : 'mongodb://localhost:27017/moviesdb');
app.use(limitter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(cors);
app.use(router);

app.use(errorLogger);
app.use(validationErrorsHandler());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
