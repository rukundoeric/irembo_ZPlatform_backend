/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';

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
