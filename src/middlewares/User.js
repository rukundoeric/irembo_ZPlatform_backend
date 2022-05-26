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
