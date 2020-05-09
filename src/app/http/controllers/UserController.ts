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
import UserModel, { IUserSchema } from '../../models/UserModel';
import ModelFactory from '../../factories/ModelFactory';
import Responses from '../../builders/Responses';
import { whitelist } from '../../../config/validations';

@JsonController('/users')
@UseBefore(AuthMiddleware)
export default class UserController {
  /**
   * Special operations
   */
  @Get('/spc/me')
  public async getMe(@Req() req: Request, @Res() res: Response) {
    const user = await new ModelFactory<IUserSchema>(UserModel).getOne(
      req.user.id
    );
    return Responses.Success(res, user);
  }

  @Patch('/spc/updateMe')
  public async updateMe(
    @BodyParam('name') name: string,
    @UploadedFile('photo') photo: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = await new ModelFactory<IUserSchema>(UserModel).update(
      req.user.id,
      { name },
      { new: true }
    );
    return Responses.Success(res, user);
  }

  @Delete('/spc/deleteMe')
  public async deleteMe(@Req() req: Request, @Res() res: Response) {
    await new ModelFactory<IUserSchema>(UserModel).softDelete(
      { _id: req.user.id, active: { $ne: false } },
      { active: false }
    );
    return Responses.Success(res, null, 'Your account has been deleted!');
  }

  /**
   * CRUD operations
   */

  @Post()
  public async create(@Body() req: CreateUserRequest, @Res() res: Response) {
    const user = await new ModelFactory<IUserSchema>(UserModel).create(req);
    return Responses.Success(res, user);
  }

  @Get()
  public async getAll(@Req() req: Request, @Res() res: Response) {
    const users = await new ModelFactory<IUserSchema>(UserModel).getAll(
      req.query
    );
    return Responses.Success(res, { users });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const user = await new ModelFactory<IUserSchema>(UserModel).getOne(id);
    return Responses.Success(res, { user });
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body(whitelist) req: UpdateUserRequest,
    @Res() res: Response
  ) {
    const user = await new ModelFactory<IUserSchema>(UserModel).update(
      id,
      req,
      {
        new: true,
        runValidators: true,
      }
    );
    return Responses.Success(res, { user });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    await new ModelFactory<IUserSchema>(UserModel).softDelete(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    return Responses.Success(res, null, 'User has been deleted!');
  }
}
