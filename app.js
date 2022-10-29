require('dotenv').config();
const express = require('express');
const db = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors: validationErrorsHandler } = require('celebrate');
const router = require('./routes/index');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV } = process.env;

const app = express();
db.connect('mongodb://localhost:27017/bitfilmsdb');
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(router);

app.use(errorLogger);
app.use(validationErrorsHandler());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
