const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountVerificationRequest extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'account',
        foreignKey: 'account_id',
        targetKey: 'user_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  AccountVerificationRequest.init({
    request_id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    account_id: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AccountVerificationRequest',
  });
  return AccountVerificationRequest;
};
