import { Response } from 'express';
import { JsonController, Body, Post, Res } from 'routing-controllers';
import LoginRequest from '../requests/LoginRequest';
import AppError from '../utils/helpers/AppError';
import Auth from '../utils/helpers/Auth';
import UserModel from '../models/UserModel';
import Responses from '../utils/builders/Responses';

@JsonController('/auth')
export default class UserController {
  @Post('/login')
  public async login(@Body() request: LoginRequest, @Res() res: Response) {
    const { username, password } = request;

    if (!username || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await UserModel.findOne({ username }).select('+password');

    if (!user || !(await user.auth(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = Auth.jwtSign(user.id);
    return Responses.Success(res, { token });
  }
}
