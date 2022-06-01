/* eslint-disable max-len */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import String from '@supercharge/strings';
import { generateToken, generatePassword, decodeJWT } from '../../helpers';
import { Auth, User, Profile } from '../../db/models';
import config from '../../config';
import { sendOneTimePassword } from '../../services';

const { serverConfig } = config;
const { httpOnlyCookieOptions: cookieOptions } = serverConfig;

class AuthController {
  static async login(req, res, next) {
    const { user } = req;
    const { user_id, email, role } = user;
    let auth = await Auth.findOne({
      where: { user_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    auth.user = auth?.user?.dataValues;
    if (!req?.user?.email_verified) return res.status(401).json({ message: 'Email not verified!' });
    if (auth?.s_factor_auth === 'on') {
      req.user = { ...user, m_f_auth: auth.s_factor_auth };
      req.auth = auth;
      return next();
    }
    const userData = { user_id, email, role };
    const access_token = await generateToken(userData, { type: 'access-token' });
    const refresh_token = await generateToken(userData, { type: 'refresh-token' }, '1d');
    const result = await Auth.update({ refresh_token }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    res
      .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({ access_token, user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token } });
  }

  static async loginWithAccessToken(req, res, next) {
    const { login_token } = req.body;
    let auth = await Auth.findOne({
      where: { login_token },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    if (!auth) return res.status(401).json({ message: 'Invalid token!' });
    auth.user = auth?.user?.dataValues;
    const { user_id, email, role } = auth.user;
    if (!auth?.user?.email_verified) return res.status(401).json({ message: 'Email not verified!' });
    if (auth?.s_factor_auth === 'on') {
      req.user = { ...auth.user, m_f_auth: auth.s_factor_auth };
      req.auth = auth;
      return next();
    }
    const userData = { user_id, email, role };
    const access_token = await generateToken(userData, { type: 'access-token' });
    const refresh_token = await generateToken(userData, { type: 'refresh-token' }, '1d');
    const result = await Auth.update({ refresh_token }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    res
      .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({ access_token, user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token } });
  }

  static async sendOneTimePassword(req, res) {
    const { user: { user_id, email, m_f_auth } } = req;
    const password = generatePassword(true, null, false);
    const passwordHash = generatePassword(false, password);
    const one_time_password = await generateToken({ password: passwordHash }, { type: 'one-time-password' }, '5m');
    const result = await Auth.update({ one_time_password }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    sendOneTimePassword({ email, password });
    res.json({
      user: { user_id, email, m_f_auth },
      message: `Your one time password is sent to your email: ${email}.`,
    });
  }

  static async turnOnOrOffSecondFactorAuth(req, res) {
    const { value: s_factor_auth, user_id } = req.body;
    const result = await Auth.update({ s_factor_auth }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    let auth = await Auth.findOne({
      where: { user_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    if (!auth) return res.sendStatus(500);
    auth.user = auth?.user?.dataValues;
    res.json({
      message: auth.s_factor_auth === 'on'
        ? 'Second-factor authentication is on. please note that from now, before you are loggeed in to the system, first you will be asked to provided a one-time-password that will be shared to you via email.'
        : 'Second-factor authentication is off',
      user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token }
    });
  }

  static async validateLoginToken(req, res) {
    const { value } = req.body;
    const { user_id } = req.authUser;
    const login_token = value === 'off' ? String.random(50) : null;
    const result = await Auth.update({ login_token }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    let auth = await Auth.findOne({
      where: { user_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    if (!auth) return res.sendStatus(500);
    auth.user = auth?.user?.dataValues;
    res.json({
      user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token },
      login_token,
      message: auth.login_token
        ? 'Your personal access token is generated. Please note that anyone with that token would have access to your account. so we strongly recomend you to turn on Second-factor authentication if you haven\'t done so.'
        : 'Your personal access token is invalidated!',
    });
  }

  static async secondFactorAuth(req, res) {
    const { user_id, password } = req.body;
    let auth = await Auth.findOne({
      where: { user_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    if (!auth) return res.sendStatus(401);
    auth.user = auth?.user?.dataValues;
    const encodedPassword = auth?.one_time_password;
    decodeJWT(encodedPassword, async (err, decoded) => {
      if (err) return res.status(403).json({ error: { message: 'Password is invalid or expired!' } });
      const isCorrectPassword = bcrypt.compareSync(password, decoded.password);
      if (!isCorrectPassword) return res.status(401).json({ error: { message: 'Password is incorrect!' } });
      const userData = { user_id, email: auth?.user?.email, role: auth?.user?.role };
      const access_token = await generateToken(userData, { type: 'access-token' });
      const refresh_token = await generateToken(userData, { type: 'refresh-token' }, '1d');
      const result = await Auth.update({ refresh_token }, { where: { user_id } });
      if (!result) return res.sendStatus(500);
      await Auth.update({ one_time_password: null }, { where: { user_id } });
      res
        .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
        .json({ access_token, user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token } });
    });
  }

  static async refreshToken(req, res) {
    const { cookies } = req;
    if (!cookies?.refresh_token) return res.sendStatus(401);
    const { refresh_token } = cookies;
    let auth = await Auth.findOne({
      where: { refresh_token },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'email', 'role', 'email_verified', 'account_verified'],
        include: [{
          model: Profile,
          as: 'profile'
        }],
      }],
    });
    auth = auth?.dataValues;
    if (!auth) return res.sendStatus(401);
    auth.user = auth?.user?.dataValues;
    decodeJWT(refresh_token, async (err, decoded) => {
      if (err || !decoded?.user_id || decoded?.user_id !== auth?.user?.user_id) return res.sendStatus(403);
      const access_token = await generateToken({ user_id: decoded?.user_id }, { type: 'access-token' });
      res
        .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
        .json({
          access_token,
          user: { ...auth.user, m_f_auth: auth.s_factor_auth, is_login_token_on: !!auth?.login_token }
        });
    });
  }

  static async logout(req, res) {
    const { cookies } = req;
    if (!cookies?.refresh_token) return res.sendStatus(204);
    const { refresh_token } = cookies;
    let result = await Auth.findOne({ where: { refresh_token } });
    result = result?.dataValues;
    const user_id = result?.user_id;
    if (!user_id) {
      res.clearCookie('refresh_token', { ...cookieOptions });
      return res.sendStatus(204);
    }
    await Auth.update({ refresh_token: null }, { where: { user_id } });
    res
      .clearCookie('refresh_token', { ...cookieOptions })
      .sendStatus(204);
  }
}

export default AuthController;
