/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
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
  Profile.init({
    user_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    photo: DataTypes.TEXT,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    marital_status: DataTypes.STRING,
    nationality: DataTypes.STRING,
    n_id: DataTypes.STRING,
    n_id_image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};
