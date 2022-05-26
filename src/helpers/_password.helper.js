/* eslint-disable import/prefer-default-export */
import 'regenerator-runtime';
import bcrypt from 'bcrypt';
import { generate } from 'generate-password';

export const generatePassword = (autoGen = true, pass = null, hashed = true) => {
  const passN = autoGen
    ? generate({
      length: 8,
      numbers: true,
    })
    : pass;
  return hashed ? bcrypt.hashSync(passN, 8) : passN;
};
