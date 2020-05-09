import { Response } from 'express';
import {
  JsonController,
  UseBefore,
  Res,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from 'routing-controllers';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import ReviewModel, { IReviewSchema } from '../../models/ReviewModel';
import ModelFactory from '../../utils/factories/ModelFactory';
import Responses from '../../utils/builders/Responses';
import AppError from '../../utils/helpers/AppError';

@JsonController('/reviews')
@UseBefore(AuthMiddleware)
export default class ReviewController {
  /**
   * CRUD operations
   */

  // TODO: Type req body
  @Post()
  public async create(@Body() req: any, @Res() res: Response) {
    const review = await new ModelFactory<IReviewSchema>(ReviewModel).create(
      req
    );
    return Responses.Success(res, { review });
  }

  @Get()
  public async getAll(@Res() res: Response) {
    const reviews = await new ModelFactory<IReviewSchema>(ReviewModel).getAll();
    return Responses.Success(res, { reviews });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const review = await new ModelFactory<IReviewSchema>(ReviewModel).getOne(
      id
    );
    return Responses.Success(res, { review });
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response
  ) {
    const review = await new ModelFactory<IReviewSchema>(ReviewModel).update(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );
    return Responses.Success(res, { review });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    await new ModelFactory<IReviewSchema>(ReviewModel).softDelete(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    return Responses.Success(res, null, 'Review has been deleted!');
  }
}
