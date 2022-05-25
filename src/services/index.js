/* eslint-disable import/prefer-default-export */
import 'regenerator-runtime';
import {
  sendEmailVerificationService as sendEmailVerification,
  sendPasswordResetConfirmationService as sendPasswordResetConfirmation,
  sendOneTimePasswordService as sendOneTimePassword,
  sendNotificationService as sendNotification,
} from './_sendMail.service';

export {
  sendEmailVerification,
  sendPasswordResetConfirmation,
  sendOneTimePassword,
  sendNotification
};
