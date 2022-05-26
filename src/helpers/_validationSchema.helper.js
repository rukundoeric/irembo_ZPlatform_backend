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

const confirm = new PasswordComplexity({
  min: 8,
  max: 25,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
});

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

schemas.profile = Joi.object().keys({
  photo: Joi.string().uri(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  age: Joi.number(),
  gender: Joi.string(),
  date_of_birth: Joi.string(),
  marital_status: Joi.string().valid('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
  nationality: Joi.string(),
});

export default schemas;
