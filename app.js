const express = require('express');
const db = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors: validationErrorsHandler } = require('celebrate');
const cors = require('./middlewares/cors');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limitter = require('./middlewares/limitter');
const { DB_PATH, PORT, NODE_ENV } = require('./server.config');

const app = express();

db.connect(DB_PATH);
app.use(requestLogger);
app.use(limitter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors);
app.use(router);

app.use(errorLogger);
app.use(validationErrorsHandler());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
