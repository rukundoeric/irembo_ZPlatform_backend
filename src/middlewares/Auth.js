/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';
import { decodeJWT } from '../helpers';
import { User, Profile } from '../db/models';

export const verifyAccessToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const { roles = ['1.0.0', '1.1.0', '1.1.1'] } = req;
  if (!authorization) return res.sendStatus(401);
  const token = authorization.split(' ')[1];
  if (!token || token === 'undefined') return res.sendStatus(401);
  decodeJWT(token, async (err, decoded) => {
    const user_id = decoded?.user_id;
    const type = decoded?.type;
    if (err || !user_id || !type || type !== 'access-token') return res.sendStatus(403);
    let user = await User.findOne({
      where: { user_id },
      include: [{
        model: Profile,
        as: 'profile',
      }],
    });
    user = user?.dataValues;
    user.profile = user?.profile?.dataValues;
    if (!user || (!roles.includes(user.role))) return res.sendStatus(403);
    req.authUser = user;
    next();
  });
};

export const checkCredentials = async (req, res, next) => {
  const { user, body: { password } } = req;
  const isCorrectPassword = bcrypt.compareSync(password, user.password);
  if (!isCorrectPassword) {
    return res.status(401).send({
      error: { message: 'Password is incorrect!' },
    });
  }
  next();
};

export const verifyEmailVerificationToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token || token === 'undefined') return res.sendStatus(401);
  decodeJWT(token, async (err, decoded) => {
    const user_id = decoded?.user_id;
    const type = decoded?.type;
    if (err || !user_id || !type || type !== 'email-verification') return res.sendStatus(403);
    let user = await User.findOne({ where: { user_id } });
    user = user?.dataValues;
    if (!user) return res.sendStatus(403);
    req.authUser = user;
    next();
  });
};
