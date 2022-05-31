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

schemas.loginWithToken = Joi.object().keys({
  login_token: Joi.string().required().label('Token is required'),
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
  photo: Joi.string().uri().required().label('Profile image is required and should be a valid image url'),
  first_name: Joi.string().required().label('Nationality is required'),
  last_name: Joi.string().required().label('Nationality is required'),
  age: Joi.number().required().label('Nationality is required'),
  gender: Joi.string().valid('MALE', 'FEMALE').required().label('Gender is required and it should be either MALE or FEMALE'),
  date_of_birth: Joi.string().required().label('Date of birst is required and should be a valid date'),
  marital_status: Joi.string().valid('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED').required().label('Marital status is required ans should either SINGLE, MARRIED, DIVORCED or WIDOWED'),
  nationality: Joi.string().required().label('Nationality is required'),
});

schemas.accountVerification = Joi.object().keys({
  n_id: Joi.number().label('National/Passport number is required'),
  n_id_image: Joi.string().uri().required().label('Official document image is required and should be a valid image url'),
});

export default schemas;
