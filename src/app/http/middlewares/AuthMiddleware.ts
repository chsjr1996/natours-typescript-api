import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../helpers/AppError';
import Auth from '../../helpers/Auth';
import UsersModel from '../../models/UserModel';

interface IJWTDecoded {
  id: string;
  iat: number;
  exp: number;
}

export default class AuthMiddleware implements ExpressMiddlewareInterface {
  public async use(req: Request, res: Response, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;

    let token = '';

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.replace(/(Bearer|undefined)/gm, '').trim();
    }

    if (!token || !token.length) {
      return next(
        new AppError('You are not logged in! Please log in to get access!', 401)
      );
    }

    const decoded = (await Auth.jwtVerify(token)) as IJWTDecoded;
    const user = await UsersModel.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(
          'The token belonging to this user does no longer exist!',
          401
        )
      );
    }

    if (user.isPasswordChanged(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password. Please log in again!',
          401
        )
      );
    }

    req.user = {
      id: user._id,
    };

    next();
  }
}
