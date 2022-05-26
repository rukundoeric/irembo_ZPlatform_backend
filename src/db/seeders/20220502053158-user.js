/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const { v4: uuidv4 } = uuid;

dotenv.config();
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          user_id: uuidv4(),
          email: 'moderator@gmail.com',
          password: bcrypt.hashSync('moderator', 10),
          role: '1.1.0',
          email_verified: true,
          account_verified: 'VERIFIED.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
