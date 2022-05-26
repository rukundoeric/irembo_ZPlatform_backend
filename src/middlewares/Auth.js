/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';
import { decodeJWT } from '../helpers';
import { User } from '../db/models';

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
