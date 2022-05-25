/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable max-len */
import 'regenerator-runtime';
import mailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();
const {
  OAUTH2_USER,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI,
  OAUTH2_REFRESH_TOKEN
} = process.env;
const oAuth2Client = new google.auth.OAuth2(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: OAUTH2_REFRESH_TOKEN });

const sentMail = async (emailTo, subject, template) => {
  console.log(`PID: ${process.pid} === SENDING EMAIL ===`);
  try {
    const OAUTH2_ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    const transport = mailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: OAUTH2_USER,
        clientId: OAUTH2_CLIENT_ID,
        clientSecret: OAUTH2_CLIENT_SECRET,
        refreshToken: OAUTH2_REFRESH_TOKEN,
        accessToken: OAUTH2_ACCESS_TOKEN,
      }
    });

    const mailOptions = {
      from: `ZPlatform <${process.env.EMAIL_SENDER}>`,
      to: emailTo,
      subject,
      html: template,
      generateTextFromHTML: true,
    };

    const res = await transport.sendMail(mailOptions);
    res.accepted ? console.log(`PID: ${process.pid} === EMAIL SENT ===`)
      : console.log(`PID: ${process.pid} === EMAIL NOT SENT ===`);

    return res;
  } catch (error) {
    return error;
  }
};

export default sentMail;
