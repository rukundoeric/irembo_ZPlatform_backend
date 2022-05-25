/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import 'regenerator-runtime';
import workerfarm from 'worker-farm';
import { sendMailWorker } from '../workers';
import { notifications } from '../helpers';
import {
  emailVerificationTemplate,
  passWordResetTemplate,
  oneTimePasswordTemplate,
  notificationTemplate
} from '../templates';

export const sendEmailVerificationService = (data) => {
  console.log(`PID: ${process.pid} === SENDING EMAIL VERIFICATION SERVICE STARTED===`);
  const link = `${process.env.FRONTEND_HOST}/verify?session=${data.token}`;
  sendMailWorker(data, 'Email verification', emailVerificationTemplate(link), () => {
    workerfarm.end(sendMailWorker);
  });
};

export const sendPasswordResetConfirmationService = (data) => {
  console.log(`PID: ${process.pid} === SENDING PASSWORD RESET CONFIRMATION EMAIL SERVICE STARTED===`);
  const link = `${process.env.FRONTEND_HOST}/reset-password?session=${data.token}`;
  sendMailWorker(data, 'Password reset', passWordResetTemplate(link), () => {
    workerfarm.end(sendMailWorker);
  });
};

export const sendOneTimePasswordService = (data) => {
  console.log(`PID: ${process.pid} === SENDING ONE TIME PASSWORD SERVICE STARTED===`);
  const { password } = data;
  sendMailWorker(data, 'One Time Password', oneTimePasswordTemplate(password), () => {
    workerfarm.end(sendMailWorker);
  });
};

export const sendNotificationService = (data) => {
  console.log(`PID: ${process.pid} === SENDING NOTIFICATION SERVICE STARTED===`);
  const { type, more } = data;
  const notificatioObj = notifications[type](more);

  sendMailWorker(data, notificatioObj?.title, notificationTemplate(notificatioObj), () => {
    workerfarm.end(sendMailWorker);
  });
};
