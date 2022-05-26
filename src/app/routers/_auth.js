import 'regenerator-runtime';
import express from 'express';
import AuthController from '../controllers/Auth.controller';
import { checkCredentials } from '../../middlewares/Auth';
import { checkUserExist } from '../../middlewares/User';

const {
  login,
  logout,
  sendOneTimePassword,
  secondFactorAuth,
  refreshToken
} = AuthController;

const router = express.Router();

router.post('/login', checkUserExist, checkCredentials, login, sendOneTimePassword);
router.post('/second-factor-auth', secondFactorAuth);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);

export default router;
