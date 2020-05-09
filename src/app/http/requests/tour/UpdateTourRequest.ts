import { Request } from 'express';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsNotEmptyObject,
  IsDate,
} from 'class-validator';
import { ILocation, IGuide } from '../../../models/TourModel';

export default class UpdateTourRequestBody {
  @IsString()
  name?: string;

  @IsString()
  slug?: string;

  @IsNumber()
  duration?: number;

  @IsNumber()
  maxGroupSize?: number;

  @IsString()
  difficulty?: string;

  @IsNumber()
  ratingsAverage?: number;

  @IsNumber()
  ratingsQuantity?: number;

  @IsNumber()
  price?: number;

  @IsNumber()
  priceDiscount?: number;

  @IsString()
  summary?: string;

  @IsString()
  description?: string;

  @IsString()
  imageCover?: string;

  @IsArray()
  images?: string[];

  @IsDate()
  createdAt?: Date;

  @IsArray()
  startDates?: Date[];

  @IsBoolean()
  secretTour?: boolean;

  @IsNotEmptyObject()
  startLocation?: ILocation;

  @IsArray()
  locations?: ILocation[];

  @IsArray()
  guides?: IGuide[];

  @IsBoolean()
  active?: boolean;
}

export interface UpdateTourRequest extends Request {
  files: {
    imageCover: Express.Multer.File[];
    images: Express.Multer.File[];
  };
}
