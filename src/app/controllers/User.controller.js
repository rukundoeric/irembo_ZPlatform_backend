/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import { v4 as uuid } from 'uuid';
import { User, Auth, Profile } from '../../db/models';
import { generateToken, generatePassword } from '../../helpers';
import { sendEmailVerification, sendPasswordResetConfirmation } from '../../services';
import config from '../../config';

const { serverConfig } = config;
const { httpOnlyCookieOptions: cookieOptions } = serverConfig;

class UserController {
  static async signup(req, res) {
    const { body } = req;
    const userObject = {
      user_id: uuid(),
      email: body.email,
      password: generatePassword(false, body.password),
      role: '1.0.0',
      email_verified: false,
      account_verified: false,
    };
    let newUser = await User.create(userObject);
    newUser = newUser?.dataValues;
    if (!newUser) return res.sendStatus(500);
    const authObject = { user_id: newUser.user_id };
    const profileObject = { user_id: newUser.user_id };
    await Auth.create(authObject);
    await Profile.create(profileObject);
    const email_verify_token = await generateToken({ user_id: newUser.user_id }, { type: 'email-verification' }, '5m');
    sendEmailVerification({ email: newUser.email, token: email_verify_token });
    res.status(201).json({
      message: `Account created! email verification link was sent to ${newUser.email}. Please, check your email.`,
    });
  }

  static async verifyUserEmail(req, res) {
    const { user_id, email, role } = req.authUser;
    const result = await User.update({ email_verified: true }, { where: { user_id } });
    if (!result.includes(1)) {
      return res.status(500).json({
        error: { message: 'Email not verified' }
      });
    }
    const userData = { user_id, email, role };
    const access_token = await generateToken(userData, { type: 'access-token' });
    const refresh_token = await generateToken(userData, { type: 'refresh-token' }, '1d');
    const authResult = await Auth.update({ refresh_token }, { where: { user_id } });
    if (!authResult) return res.sendStatus(500);
    res
      .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({ access_token });
  }

  static async resendEmailVerification(req, res) {
    const { user: { user_id, email } } = req;
    const email_verify_token = await generateToken({ user_id }, { type: 'email-verification' }, '5m');
    sendEmailVerification({ email, token: email_verify_token });
    res.json({
      message: `Email Verification is Sent to ${email}`,
    });
  }

  // Password reset
  static async requestPasswordReset(req, res) {
    const { email, user_id } = req.user;
    const reset_token = await generateToken({ user_id }, { type: 'password-reset-token' }, '5m');
    const result = await Auth.update({ reset_token }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    sendPasswordResetConfirmation({ email, token: reset_token });
    res.json({
      message: `Password reset confirmation is sent to ${email}`,
    });
  }

  static async applyChangePassword(req, res) {
    const { user_id } = req.user;
    let { password, confirm } = req.body;
    if (password !== confirm) return res.sendStatus(400);
    password = generatePassword(false, password);
    const result = await User.update({ password }, { where: { user_id } });
    if (!result.includes(1)) return res.sendStatus(500);
    res.sendStatus(200);
  }

  static async resendPasswordResetConfirmation(req, res) {
    const { email, user_id } = req.user;
    const reset_token = await generateToken({ user_id }, { type: 'password-reset-token' }, '5m');
    const result = await Auth.update({ reset_token }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    sendPasswordResetConfirmation({ email, token: reset_token });
    res.json({
      message: `Password reset confirmation is sent to ${email}`,
    });
  }

  static async updateProfile(req, res) {
    const { user_id } = req.authUser;
    const { body } = req;
    const result = await Profile.update({ ...body }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    res.json({
      message: 'Profile updtaded'
    });
  }

  // This is different from email verfication.
  // Here, user will have to submit image of an official document,
  // That will be reviewed by the moderator or admin so that they can confirm or reject it.
  static async requestAccountVerification(req, res) {
    
  }
}

export default UserController;
