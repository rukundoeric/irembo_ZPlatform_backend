/* eslint-disable max-len */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import { generateToken, generatePassword, decodeJWT } from '../../helpers';
import { Auth, User } from '../../db/models';
import config from '../../config';
import { sendOneTimePassword } from '../../services';

const { serverConfig } = config;
const { httpOnlyCookieOptions: cookieOptions } = serverConfig;

class AuthController {
  static async login(req, res, next) {
    const { user } = req;
    const { user_id, email, role } = user;
    let auth = await Auth.findOne({ where: { user_id } });
    auth = auth?.dataValues;
    if (!req?.user?.email_verified) return res.status(401).json({ message: 'Email not verified!' });
    if (auth.s_factor_auth === 'on') {
      req.user = user;
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
      .json({ access_token });
  }

  static async sendOneTimePassword(req, res) {
    const { user: { user_id, email } } = req;
    const password = generatePassword(true, null, false);
    const passwordHash = generatePassword(false, password);
    const one_time_password = await generateToken({ password: passwordHash }, { type: 'one-time-password' }, '5m');
    const result = await Auth.update({ one_time_password }, { where: { user_id } });
    if (!result) return res.sendStatus(500);
    sendOneTimePassword({ email, password });
    res.json({
      user: { user_id, email },
      message: `Your one time password is sent to your email: ${email}.`,
    });
  }

  static async secondFactorAuth(req, res) {
    const { user_id, password } = req.body;
    let auth = await Auth.findOne({ where: { user_id } });
    auth = auth?.dataValues;
    if (!auth) return res.sendStatus(401);
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
        .json(access_token);
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
        attributes: ['user_id', 'email']
      }],
    });
    auth = auth?.dataValues;
    auth.user = auth?.user?.dataValues;

    if (!auth) return res.sendStatus(403);
    decodeJWT(refresh_token, async (err, decoded) => {
      if (err || !decoded?.user_id || decoded?.email !== auth?.user?.email) return res.sendStatus(403);
      const access_token = await generateToken({ email: decoded?.email }, { type: 'access-token' });
      res.json({
        access_token,
        userData: {
          user_id: auth?.user?.user_id,
          email: auth?.user?.u_email,
          role: auth?.user?.role,
        }
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
