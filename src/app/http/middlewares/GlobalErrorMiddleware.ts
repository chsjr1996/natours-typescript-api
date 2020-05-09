import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import envs from '../../../config/app';

interface IError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

@Middleware({ type: 'after' })
export default class GlobalErrorMiddleware
  implements ExpressErrorMiddlewareInterface {
  error(
    error: IError,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (envs.core.isDev) {
      return this.developmentError(error, response);
    }
    return this.productionError(error, response);
  }

  /**
   * Prodution error template
   */
  private productionError(err: IError, res: Response) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  /**
   * Development error template
   */
  private developmentError(err: IError, res: Response) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
}
