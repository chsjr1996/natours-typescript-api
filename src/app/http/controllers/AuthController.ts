import { Response } from 'express';
import { JsonController, Body, Post, Res } from 'routing-controllers';
import LoginRequest from '../requests/user/LoginRequest';
import AppError from '../../helpers/AppError';
import Auth from '../../helpers/Auth';
import UserModel from '../../models/UserModel';
import Responses from '../../builders/Responses';

@JsonController('/auth')
export default class UserController {
  @Post('/login')
  public async login(@Body() request: LoginRequest, @Res() res: Response) {
    const { email, password } = request;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !(await user.auth(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = Auth.jwtSign(user.id);
    return Responses.Success(res, { token });
  }
}
