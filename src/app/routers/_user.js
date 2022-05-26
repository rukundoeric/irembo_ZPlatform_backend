import 'regenerator-runtime';
import express from 'express';
import UserController from '../controllers/User.controller';
import { checkUserAlreadyExist, checkUserExist, verifyPasswordResetToken } from '../../middlewares/User';
import { verifyEmailVerificationToken, verifyAccessToken } from '../../middlewares/Auth';
import Validator from '../../middlewares/Validator';

const {
  signup,
  verifyUserEmail,
  resendEmailVerification,
  requestPasswordReset,
  applyChangePassword,
  resendPasswordResetConfirmation,
  updateProfile,
  requestAccountVerification,
  verifyAccount
} = UserController;

const router = express.Router();

router.post('/signup', checkUserAlreadyExist, Validator('signup'), signup);
router.put('/verify-email/:token', verifyEmailVerificationToken, verifyUserEmail);
router.post('/resend-email-verification', checkUserExist, resendEmailVerification);

// password reset
router.post('/request-password-reset', checkUserExist, requestPasswordReset);
router.post('/reset-password/:token', verifyPasswordResetToken, Validator('resetpass'), applyChangePassword);
router.post('/resend-password-reset-confirmation', checkUserExist, resendPasswordResetConfirmation);

// Profile
router.put('/update-profile', verifyAccessToken, Validator('profile'), updateProfile);

// Account verfication request
router.post('/account-verification', verifyAccessToken, Validator('accountVerification'), requestAccountVerification);

// Only moderator or admin can be able to review, confirm or reject
// account verificatio requests made by other users
router.post(
  '/verify-account',
  async (req, _, next) => { req.roles = ['1.1.0', '1.1.1']; next(); },
  verifyAccessToken,
  verifyAccount,
);

export default router;
