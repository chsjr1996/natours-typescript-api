// import path from 'path';
import express, { Express } from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import envs from './utils/envs';

export default class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.database();
  }

  /** Attributes */

  /**
   * Express app
   */
  public app: Express;

  /**
   * Env control var
   */
  private isDev = envs.isDev;

  /** Methods */

  /**
   * Start all app middlewares before routes
   */
  private middlewares() {
    // this.app.use(express.static(path.join(__dirname, '..', 'public')));
    if (this.isDev) {
      this.app.use(morgan('dev'));
    }
  }

  /**
   * Start database
   */
  private database() {
    if (!envs.database) {
      throw new Error('No database uri configured in .env file!');
    }
    const DB = envs.database;
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log('DB connection established.'));
  }
}
