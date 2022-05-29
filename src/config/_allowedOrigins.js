import 'regenerator-runtime';
import dotenv from 'dotenv';

dotenv.config();

export default [
  process.env.PRODUCTION_ORIGIN,
  process.env.DEVELOPMENT_ORIGIN,
  'http://localhost:3001'
];
