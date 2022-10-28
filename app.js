const express = require('express');

const { PORT = 3000, NODE_ENV } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
