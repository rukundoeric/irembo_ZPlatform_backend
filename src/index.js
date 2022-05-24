import 'regenerator-runtime';
import logger from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/models/index';
import api from './app/routers';

dotenv.config();
const app = express();
const { sequelize: databaseConnection } = db;
app
  .use(express.json())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use()
  .use(cors())
  .use(logger('dev'))
  .use(cookieParser())
  .use('/', api)
  .set('port', port);

  databaseConnection.sync().then(() => {
    app.listen(port, () => console.log(`Process ID: ${process.pid} \n Port : ${port} \t Mode: ${process.env.NODE_ENV} \n Database status: connected ✅`))
  })

  export default app;