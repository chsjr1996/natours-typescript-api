import mongoose, { Document, Schema, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import IModel from './IModel';
import Auth from '../utils/helpers/Auth';

interface IUserSchema extends Document {
  name: string;
  username: string;
  password: string;
  passwordChangedAt: Date;
  userType: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  auth: (password: string) => Promise<boolean>;
  isPasswordChanged: (timestamp: number) => boolean;
}

class UserModel implements IModel {
  constructor() {
    this.schema = this.initSchema();
    this.hooks();
    this.methods();
    this.model = this.initModel();
  }

  public schema: Schema<IUserSchema>;
  public model: Model<IUserSchema>;

  public initSchema() {
    return new mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
      },
      username: {
        type: String,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        select: false,
      },
      passwordChangedAt: Date,
      userType: {
        type: Number,
        default: 1,
      },
      createAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now(),
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    });
  }

  public hooks() {
    // Crypt password
    this.schema.pre<IUserSchema>('save', async function (
      next: HookNextFunction
    ) {
      if (!this.isModified('password')) next();
      this.password = await Auth.hash(this.password);
    });

    // Not show deleted
    this.schema.pre<Model<IUserSchema>>(/^find/, function (
      next: HookNextFunction
    ) {
      this.find({ isDeleted: { $ne: true } });
      next();
    });
  }

  public methods() {
    // Check password
    this.schema.methods.auth = async function (
      this: IUserSchema,
      passwordString: string
    ): Promise<boolean> {
      return await Auth.compare(passwordString, this.password);
    };

    // Check if user change password after login
    this.schema.methods.isPasswordChanged = function (
      this: IUserSchema,
      timestamp: number
    ): boolean {
      if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
        return timestamp < changedTimestamp;
      }
      return false;
    };
  }

  public initModel() {
    return mongoose.model<IUserSchema>('Users', this.schema);
  }
}

export default new UserModel().model;
