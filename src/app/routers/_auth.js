import 'regenerator-runtime';
import express from 'express';
import AuthController from '../controllers/Auth.controller';
import { checkCredentials, verifyAccessToken } from '../../middlewares/Auth';
import { checkUserExist } from '../../middlewares/User';
import Validator from '../../middlewares/Validator';

const {
  login,
  logout,
  sendOneTimePassword,
  secondFactorAuth,
  refreshToken,
  turnOnOrOffSecondFactorAuth,
  loginWithAccessToken,
  validateLoginToken,
} = AuthController;
const router = express.Router();

router.post('/login', checkUserExist, checkCredentials, login, sendOneTimePassword);
router.post('/login-with-token', Validator('loginWithToken'), loginWithAccessToken, sendOneTimePassword);
router.put('/login-with-token/validate', verifyAccessToken, validateLoginToken);
router.put('/second-factor-auth', verifyAccessToken, turnOnOrOffSecondFactorAuth);
router.post('/resend-one-time-password', checkUserExist, login, sendOneTimePassword);
router.post('/second-factor-auth', secondFactorAuth);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);

export default router;
