/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Auth, {
        foreignKey: 'user_id'
      });
      this.hasOne(models.Profile, {
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
    account_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
