import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { Express } from 'express';
import App from './App';
import envs from './config/app';
import GlobalErrorMiddleware from './app/http/middlewares/GlobalErrorMiddleware';

class Server {
  constructor() {
    this.app = new App().app;
    this.start();
  }

  private app: Express;

  private start() {
    useExpressServer(this.app, {
      defaultErrorHandler: false,
      routePrefix: '/api/v1',
      controllers: [__dirname + '/app/http/controllers/*.js'],
      middlewares: [GlobalErrorMiddleware],
    });

    const port = envs.core.port;
    this.app.listen(port, () => {
      console.log(`Server running in port ${port}`);
    });
  }
}

new Server();
