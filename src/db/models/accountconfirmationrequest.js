const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountConfirmationRequest extends Model {
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
  AccountConfirmationRequest.init({
    request_id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    account_id: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AccountConfirmationRequest',
  });
  return AccountConfirmationRequest;
};
