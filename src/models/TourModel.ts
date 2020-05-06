import mongoose, { Document, Schema, Model, HookNextFunction } from 'mongoose';
import IModel from './IModel';

export interface ILocation {
  type: { type: string; default: string };
  coordinates: number[];
  address: string;
  description: string;
  day?: number;
}

export interface IGuide {
  type: mongoose.Types.ObjectId;
  ref: string;
}

interface ITourSchema extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
  startLocation: ILocation;
  locations: ILocation[];
  guides: IGuide[];
  active: boolean;
}

class TourModel implements IModel {
  constructor() {
    this.schema = this.initSchema();
    this.hooks();
    this.model = this.initModel();
  }

  public schema: Schema<ITourSchema>;
  public model: Model<ITourSchema>;

  public initSchema() {
    return new mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
        slug: String,
        duration: {
          type: Number,
          required: true,
        },
        maxGroupSize: {
          type: Number,
          required: true,
        },
        difficulty: {
          type: String,
          required: true,
        },
        ratingsAverage: {
          type: Number,
          default: 4.5,
          set: (val: number) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          required: true,
        },
        priceDiscount: {
          type: Number,
        },
        summary: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        imageCover: {
          type: String,
          required: true,
        },
        images: [String],
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        startDates: [Date],
        secretTour: {
          type: Boolean,
          default: false,
        },
        startLocation: {
          type: {
            type: String,
            default: 'Point',
          },
          coordinates: [Number],
          address: String,
          description: String,
        },
        locations: [
          {
            type: {
              type: String,
              default: 'Point',
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
          },
        ],
        guides: [
          {
            type: mongoose.Types.ObjectId,
            ref: 'User',
          },
        ],
        active: {
          type: Boolean,
          default: true,
          select: false,
        },
      },
      {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    );
  }

  public hooks() {
    // Not show inactive
    this.schema.pre<Model<ITourSchema>>(/^find/, function (
      next: HookNextFunction
    ) {
      this.find({ active: { $ne: false } });
      next();
    });
  }

  public initModel() {
    return mongoose.model<ITourSchema>('Tours', this.schema);
  }
}

export default new TourModel().model;
