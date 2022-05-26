import 'regenerator-runtime';
import express from 'express';
import UserController from '../controllers/User.controller';
import { checkUserAlreadyExist, checkUserExist, verifyPasswordResetToken } from '../../middlewares/User';
import { verifyEmailVerificationToken } from '../../middlewares/Auth';
import Validator from '../../middlewares/Validator';

const {
  signup,
  verifyUserEmail,
  resendEmailVerification,
  requestPasswordReset,
  applyChangePassword,
  resendPasswordResetConfirmation,
} = UserController;

const router = express.Router();

router.post('/signup', checkUserAlreadyExist, Validator('signup'), signup);
router.put('/verify-email/:token', verifyEmailVerificationToken, verifyUserEmail);
router.post('/resend-email-verification', checkUserExist, resendEmailVerification);

// password reset
router.post('/request-password-reset', checkUserExist, requestPasswordReset);
router.post('/reset-password/:token', verifyPasswordResetToken, Validator('resetpass'), applyChangePassword);
router.post('/resend-password-reset-confirmation', checkUserExist, resendPasswordResetConfirmation);

export default router;
