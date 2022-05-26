/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
        targetKey: 'user_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Auth.init({
    user_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    s_factor_auth: {
      type: DataTypes.STRING,
      defaultValue: 'off',
    }, // on or off
    one_time_password: DataTypes.TEXT,
    refresh_token: DataTypes.TEXT,
    login_token: DataTypes.TEXT,
    reset_token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Auth',
  });
  return Auth;
};
