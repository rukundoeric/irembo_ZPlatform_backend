/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Auths', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      s_factor_auth: {
        type: Sequelize.STRING,
        defaultValue: 'off',
      }, // on or off
      one_time_password: {
        type: Sequelize.TEXT
      },
      refresh_token: {
        type: Sequelize.TEXT
      },
      login_token: {
        type: Sequelize.TEXT
      },
      reset_token: {
        type: Sequelize.TEXT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Auths');
  }
};
