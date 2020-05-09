import { Response } from 'express';
import multer from 'multer';
import {
  JsonController,
  UseBefore,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
} from 'routing-controllers';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import UpdateTourRequestBody, {
  UpdateTourRequest,
} from '../requests/tour/UpdateTourRequest';
import TourModel from '../../models/TourModel';
import Responses from '../../utils/builders/Responses';
import AppError from '../../utils/helpers/AppError';

const tourFieldOptions = multer().fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

@JsonController('/tours')
@UseBefore(AuthMiddleware)
export default class TourController {
  /**
   * Special operations
   */

  /**
   * CRUD operations
   */

  // TODO: Type req body
  @Post()
  public async create(@Body() req: any, @Res() res: Response) {
    const tour = await TourModel.create(req);
    return Responses.Success(res, tour);
  }

  @Get()
  public async getAll(@Res() res: Response) {
    const tours = await TourModel.find();
    return Responses.Success(res, { tours });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const tour = await TourModel.findById(id);
    if (!tour) throw new AppError('Tour not found!', 404);
    return Responses.Success(res, { tour });
  }

  @Patch('/:id')
  @UseBefore(tourFieldOptions)
  public async update(
    @Param('id') id: string,
    @Body({ validate: { skipMissingProperties: true } })
    body: UpdateTourRequestBody,
    @Req() req: UpdateTourRequest,
    @Res() res: Response
  ) {
    // TODO: Prepare upload for fields req.files.imageCover[0] and .images[n]
    const tour = await TourModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!tour) throw new AppError('Tour not found!', 404);
    return Responses.Success(res, { tour });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    const tour = await TourModel.findOneAndUpdate(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    if (!tour) throw new AppError('Tour not found!', 404);
    return Responses.Success(res, null, 'Tour has been deleted!');
  }
}
