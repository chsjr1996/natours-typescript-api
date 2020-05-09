import mongoose, { Schema, Model, Document, HookNextFunction } from 'mongoose';
import IModel from './IModel';

export interface IReviewSchema extends Document {
  review: string;
  rating: number;
  createdAt: string;
  tour: string;
  user: string;
  active: boolean;
}

class ReviewModel implements IModel {
  constructor() {
    this.schema = this.initSchema();
    this.hooks();
    this.model = this.initModel();
  }

  public schema: Schema<IReviewSchema>;
  public model: Model<IReviewSchema>;

  public initSchema() {
    return new mongoose.Schema(
      {
        review: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        tour: {
          type: mongoose.Types.ObjectId,
          ref: 'Tour',
          required: true,
        },
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
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
    // Populate relationship
    this.schema.pre<IReviewSchema>('/^find/', function (
      next: HookNextFunction
    ) {
      this.populate({
        path: 'user',
        select: 'name photo',
      });
      next();
    });

    // Not show inactive
    this.schema.pre<Model<IReviewSchema>>(/^find/, function (
      next: HookNextFunction
    ) {
      this.find({ active: { $ne: false } });
      next();
    });
  }

  public initModel() {
    return mongoose.model<IReviewSchema>('Review', this.schema);
  }
}

export default new ReviewModel().model;
