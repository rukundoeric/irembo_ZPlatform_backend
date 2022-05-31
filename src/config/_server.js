import 'regenerator-runtime';
import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 7890,
  env: process.env.NODE_ENV,
  host: process.env.SERVER,
  httpOnlyCookieOptions: {
    httpOnly: true,
    SameSite: 'none',
    Secure: true,
    secure: true,
    sameSite: 'none'
  },
};
