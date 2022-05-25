/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
import 'regenerator-runtime';
import logger from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import credentials from './middlewares/Credentials';
import db from './db/models/index';
import api from './app/routers';
import config from './config';

dotenv.config();
const app = express();
const { corsConfig, serverConfig } = config;
const { sequelize: _ } = db;
const { port, env } = serverConfig;
app
  .use(express.json())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(credentials)
  .use(cors(corsConfig))
  .use(logger('dev'))
  .use(cookieParser())
  .use('/', api)
  .set('port', port);

_.sync()
  .then(() => app
    .listen(port, () => console.log(`=====================================\n Process ID: ${process.pid} \n Port: ${port}\n Mode:\t${env} \n Database status: connected ✅\n=====================================\n`)));
export default app;
