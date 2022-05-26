import 'regenerator-runtime';
import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';

const schemas = {};

const email = Joi.string()
  .trim()
  .lowercase()
  .email()
  .required()
  .label('Email is required and should look like this : example@email.com!');

const password = new PasswordComplexity({
  min: 8,
  max: 25,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
});

const confirm = Joi.string()
  .min(8)
  .required()
  .label('Confirm password is required,  it must have at least 8 letters');

schemas.signup = Joi.object().keys({
  email,
  password,
});

schemas.resetpass = Joi.object().keys({
  password,
  confirm,
});

schemas.resetPassword = Joi.object().keys({
  userid: Joi.any().required().label('User id is required'),
  password,
});

schemas.resendemail = Joi.object().keys({
  email
});

export default schemas;
