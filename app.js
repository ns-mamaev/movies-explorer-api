const express = require('express');
const db = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors: validationErrorsHandler } = require('celebrate');
const { DB_PATH, PORT, NODE_ENV } = require('./server.config');
const cors = require('./middlewares/cors');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limitter = require('./middlewares/limitter');

const app = express();

db.connect(DB_PATH, { family: 4 }, (err) => {
  if (err) {
    throw new Error('connection to DB failed');
  }
  console.log('==== DB connect success =======');
});
// app.use(requestLogger);
app.use(cors);
app.use(limitter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(router);

// app.use(errorLogger);
app.use(validationErrorsHandler());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
