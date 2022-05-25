/* eslint-disable max-len */
import 'regenerator-runtime';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

export const generateToken = async (payload, options, expiration = '15m') => {
  const refreshToken = await jwt.sign({ ...payload, ...options }, JWT_SECRET, { expiresIn: expiration });
  return refreshToken;
};

export const decodeJWT = (token, callback) => jwt.verify(token, JWT_SECRET, callback);
