import { Response } from 'express';

export default class Responses {
  /**
   * Success message template
   *
   * @param res Response object
   * @param message Message for user
   * @param code Http status
   */
  public static Success(
    res: Response,
    data: any,
    message?: string,
    code: number = 200
  ): Response {
    return res.status(code).json({
      status: 'success',
      ...(data && { data }),
      ...(message && { message }),
    });
  }

  /**
   * Error message template
   *
   * @param res Response object
   * @param code Http status
   * @param message Message for user
   * @param devMessage Message for developer
   * @param ex Complete exception object
   */
  public static Error(
    res: Response,
    code: number = 500,
    message: string,
    devMessage: string,
    ex: Error
  ) {
    return res.status(code).json({
      status: 'error',
      message,
      devMessage,
      ex,
    });
  }
}
