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
import ReviewModel from '../../models/ReviewModel';
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
    const review = await ReviewModel.create(req);
    return Responses.Success(res, { review });
  }

  @Get()
  public async getAll(@Res() res: Response) {
    const reviews = await ReviewModel.find();
    return Responses.Success(res, { reviews });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const review = await ReviewModel.findById(id);
    if (!review) throw new AppError('Review not found!', 404);
    return Responses.Success(res, { review });
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response
  ) {
    const review = await ReviewModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!review) throw new AppError('Review not found!', 404);
    return Responses.Success(res, { review });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    const review = await ReviewModel.findOneAndUpdate(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    if (!review) throw new AppError('Review not found!', 404);
    return Responses.Success(res, null, 'Review has been deleted!');
  }
}
