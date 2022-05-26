import 'regenerator-runtime';
import express from 'express';
import UserController from '../controllers/User.controller';
import { checkUserAlreadyExist, checkUserExist } from '../../middlewares/User';
import { verifyEmailVerificationToken } from '../../middlewares/Auth';
import Validator from '../../middlewares/Validator';

const {
  signup,
  verifyUserEmail,
  resendEmailVerification
} = UserController;

const router = express.Router();

router.post('/signup', checkUserAlreadyExist, Validator('signup'), signup);
router.put('/verify-email/:token', verifyEmailVerificationToken, verifyUserEmail);
router.post('/resend-email-verification', checkUserExist, resendEmailVerification);

export default router;
