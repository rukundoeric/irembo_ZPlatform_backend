const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  staging: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_TEST_URL',
    logging: false,
    dialect: 'postgres',
  },
};
