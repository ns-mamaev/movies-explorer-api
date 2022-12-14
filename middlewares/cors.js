const { ALLOWED_CORS, NODE_ENV } = require('../server.config');

const allowedCors = NODE_ENV === 'production'
  ? ALLOWED_CORS.split(';')
  : ['https://localhost:3000', 'http://localhost:3000'];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  // для отправки credentials в fetch
  res.header('Access-Control-Allow-Credentials', true);
  // простой CORS
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // предварительный запрос
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
