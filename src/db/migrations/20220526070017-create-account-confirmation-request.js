module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AccountVerificationRequests', {
      request_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      account_id: {
        type: Sequelize.STRING,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('AccountVerificationRequests');
  }
};
