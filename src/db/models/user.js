/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Auth, {
        as: 'auth',
        foreignKey: 'user_id'
      });
      this.hasOne(models.Profile, {
        as: 'profile',
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    user_id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    email_verified: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
    account_verified: {
      type: DataTypes.STRING,
      defaultValue: 'UNVERIFIED',
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
