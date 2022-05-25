/* eslint-disable import/prefer-default-export */
import { User } from '../db/models';

export const checkUserExist = async (req, res, next) => {
  const { body: { email } } = req;
  let user = await User.findOne({ where: { email } });
  user = user?.dataValues;
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({
      error: { message: 'account not exist!' }
    });
  }
};
