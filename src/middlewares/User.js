/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { User, Auth } from '../db/models';
import { decodeJWT } from '../helpers';

export const checkUserExist = async (req, res, next) => {
  const { body: { email } } = req;
  let user = await User.findOne({ where: { email } });
  user = user?.dataValues;
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(400).json({
      error: { message: 'account not exist!' }
    });
  }
};

export const checkUserAlreadyExist = async (req, res, next) => {
  const { body: { email } } = req;
  let user = await User.findOne({ where: { email } });
  user = user?.dataValues;
  if (user) {
    res.status(400).json({
      error: { message: 'account already exist!' }
    });
  } else {
    req.user = user;
    next();
  }
};

export const verifyPasswordResetToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token || token === 'undefined') return res.sendStatus(401);
  let auth = await Auth.findOne({ where: { reset_token: token } });
  auth = auth?.dataValues;
  if (!auth) return res.sendStatus(403);
  decodeJWT(token, async (err, decoded) => {
    if (err || !decoded) return res.sendStatus(403);
    const user_id = decoded?.user_id;
    const type = decoded?.type;
    if (!user_id || !type || type !== 'password-reset-token') return res.sendStatus(403);
    let user = await User.findOne({ where: { user_id } });
    user = user?.dataValues;
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
