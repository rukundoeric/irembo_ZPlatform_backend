import corsConfig from './_cors';
import allowedOrigins from './_allowedOrigins';
import serverConfig from './_server';

const config = {
  allowedOrigins,
  corsConfig,
  serverConfig,
};

export default config;
