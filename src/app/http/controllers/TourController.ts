import { Request, Response } from 'express';
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
import TourModel, { ITourSchema } from '../../models/TourModel';
import ModelFactory from '../../factories/ModelFactory';
import Responses from '../../builders/Responses';

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
  @Get('/spc/top-5-cheap')
  public async getTopCheap(@Req() req: Request, @Res() res: Response) {
    const reqClone: Request = Object.create(req);
    reqClone.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    return this.getAll(reqClone, res);
  }

  @Get('/spc/tours-stats')
  public async getTourStats(@Res() res: Response) {
    const toursStats = await TourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    return Responses.Success(res, { toursStats });
  }

  /**
   * CRUD operations
   */

  // TODO: Type req body
  @Post()
  public async create(@Body() req: any, @Res() res: Response) {
    const tour = await new ModelFactory<ITourSchema>(TourModel).create(req);
    return Responses.Success(res, tour);
  }

  @Get()
  public async getAll(@Req() req: Request, @Res() res: Response) {
    const tours = await new ModelFactory<ITourSchema>(TourModel).getAll(
      req.query
    );
    return Responses.Success(res, { results: tours.length, tours });
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string, @Res() res: Response) {
    const tour = await new ModelFactory<ITourSchema>(TourModel).getOne(id);
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
    const tour = await new ModelFactory<ITourSchema>(TourModel).update(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );
    return Responses.Success(res, { tour });
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string, @Res() res: Response) {
    await new ModelFactory<ITourSchema>(TourModel).softDelete(
      { _id: id, active: { $ne: false } },
      { active: false }
    );
    return Responses.Success(res, null, 'Tour has been deleted!');
  }
}
