import { Request, Response } from 'express';
import {
  JsonController,
  UseBefore,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  BodyParam,
  UploadedFile,
  Req,
  Res,
} from 'routing-controllers';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import CreateUserRequest from '../requests/user/CreateUserRequest';
import UpdateUserRequest from '../requests/user/UpdateUserRequest';
import UserModel from '../../models/UserModel';
import Responses from '../../utils/builders/Responses';
import AppError from '../../utils/helpers/AppError';
import { whitelist } from '../../../config/validations';

@JsonController('/users')
@UseBefore(AuthMiddleware)
export default class UserController {
  /**
   * Special operations
   */
  @Get('/spc/me')
  public async getMe(@Req() req: Request, @Res() res: Response) {
    const user = await UserModel.findById(req.user.id);
    return Responses.Success(res, user);
  }

  @Patch('/spc/updateMe')
  public async updateMe(
    @BodyParam('name') name: string,
    @UploadedFile('photo') photo: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    );
    return Responses.Success(res, user);
  }

  @Delete('/spc/deleteMe')
  public async deleteMe(@Req() req: Request, @Res() res: Response) {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user.id, active: { $ne: false } },
      { active: false }
    );
    if (!user) throw new AppError('User not found!', 404);
    return Responses.Success(res, null, 'Your account has been deleted!');
  }

  /**
   * CRUD operations
   */

  @Post()
  public async create(@Body() req: CreateUserRequest, @Res() res: Response) {
    const user = await UserModel.create(req);
    return Responses.Success(res, user);
  }

  @Get()
  public async getAll(@Res() res: Response) {
    const users = await UserModel.find();
    return Responses.Success(res, { users });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const user = await UserModel.findById(id);
    if (!user) throw new AppError('User not found!', 404);
    return Responses.Success(res, { user });
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body(whitelist) req: UpdateUserRequest,
    @Res() res: Response
  ) {
    const user = await UserModel.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new AppError('User not found!', 404);
    return Responses.Success(res, { user });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    const user = await UserModel.findOneAndUpdate(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    if (!user) throw new AppError('User not found!', 404);
    return Responses.Success(res, null, 'User has been deleted!');
  }
}
