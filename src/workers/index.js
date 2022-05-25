/* eslint-disable import/prefer-default-export */
import 'regenerator-runtime';
import workerfarm from 'worker-farm';

export const sendMailWorker = workerfarm(require.resolve('./_sendMail'));
