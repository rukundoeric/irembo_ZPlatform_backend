import 'regenerator-runtime';
import express from 'express';
import auth from './_auth';

const api = express();
api.use('/auth', auth);
api.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ZPlatform.',
  });
});
api.use('/', (req, res) => {
  res.status(404).json({
    message: 'Page not found.',
  });
});

export default api;
