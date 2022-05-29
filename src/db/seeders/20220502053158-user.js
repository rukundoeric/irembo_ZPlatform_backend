/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const { v4: uuidv4 } = uuid;

dotenv.config();
module.exports = {
  async up(queryInterface, Sequelize) {
    const user_id = uuidv4();
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          user_id,
          email: 'moderator@gmail.com',
          password: bcrypt.hashSync('moderator', 10),
          role: '1.1.0',
          email_verified: true,
          account_verified: 'VERIFIED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'Profiles',
      [
        {
          user_id,
          first_name: 'Mugabo',
          last_name: 'Steve',
          age: 30,
          gender: 'MALE',
          date_of_birth: '12/12/2019',
          marital_status: 'SINGLE',
          nationality: 'Rwandan',
          n_id: '1223242323232',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'Auths',
      [
        {
          user_id,
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
