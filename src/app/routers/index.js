import 'regenerator-runtime';
import express from 'express';

const api = express();
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