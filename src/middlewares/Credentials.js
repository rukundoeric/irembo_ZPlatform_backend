import config from '../config';

const { allowedOrigins } = config;
console.log(allowedOrigins);
export default (req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};
