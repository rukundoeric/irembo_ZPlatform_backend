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
  verifyAccount,
  getAllAccountVerificationRequests,
  getProfile
} = UserController;

const router = express.Router();

router.post('/signup', checkUserAlreadyExist, Validator('signup'), signup);
router.put('/verify-email/:token', verifyEmailVerificationToken, verifyUserEmail);
router.post('/resend-email-verification', checkUserExist, resendEmailVerification);

// password reset
router.post('/request-password-reset', checkUserExist, requestPasswordReset);
router.put('/reset-password/:token', verifyPasswordResetToken, Validator('resetpass'), applyChangePassword);
router.post('/resend-password-reset-confirmation', checkUserExist, resendPasswordResetConfirmation);

// Profile
router.get('/profile', verifyAccessToken, getProfile);
router.put('/update-profile', verifyAccessToken, Validator('profile'), updateProfile);

// Account verfication request
router.post('/account-verification', verifyAccessToken, Validator('accountVerification'), requestAccountVerification);

// Only moderator or admin can be able to review, confirm or reject
// account verificatio requests made by other users
router.post(
  '/verify-account/:request_id',
  async (req, _, next) => { req.roles = ['1.1.0', '1.1.1']; next(); },
  verifyAccessToken,
  verifyAccount,
);
router.get(
  '/get-verify-account-requests',
  async (req, _, next) => { req.roles = ['1.1.0', '1.1.1']; next(); },
  verifyAccessToken,
  getAllAccountVerificationRequests,
);

export default router;
