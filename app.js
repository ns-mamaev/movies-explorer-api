require('dotenv').config();
const express = require('express');
const db = require('mongoose');
const router = require('./routes');

const { PORT = 3000, NODE_ENV } = process.env;

const app = express();
db.connect('mongodb://localhost:27017/bitfilmsdb');
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
