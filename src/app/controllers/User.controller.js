/* eslint-disable camelcase */
import { generateToken } from '../../helpers';
import { User } from '../../db/models';
import { serverConfig } from '../../config';

const { httpOnlyCookieOptions: cookieOptions } = serverConfig;
/**
 * @author Rukundo Eric
 * @class AuthController
 * @description this class performs the whole authentication
 */
class UserController {
  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async login(req, res) {
    const { user: { user_id, email, role } } = req;
    const userData = { user_id, email, role };
    const access_token = await generateToken(userData, { type: 'access-token' });
    const refresh_token = await generateToken(userData, { type: 'refresh-token' }, '1d');
    const result = await User.update({ refresh_token }, { where: { email } });
    if (!result) return res.sendStatus(500);
    res
      .cookie('refresh_token', refresh_token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json(access_token, refresh_token);
  }
}

export default UserController;
