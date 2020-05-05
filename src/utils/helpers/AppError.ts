export default class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Http status code (e.g.: 200, 404, 500, etc...)
   */
  public statusCode: number;

  /**
   * Error resume
   */
  public status: string;

  /**
   * All AppError class invokes are operational error
   */
  public isOperational: boolean;
}
