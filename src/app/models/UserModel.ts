import mongoose, { Document, Schema, Model, HookNextFunction } from 'mongoose';
import IModel from './IModel';
import Auth from '../helpers/Auth';

export interface IUserSchema extends Document {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
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
        required: true,
        trim: true,
      },
      email: {
        type: String,
        unique: true,
        trim: true,
      },
      photo: {
        type: String,
        default: 'default.jpg',
      },
      role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
      },
      password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
      },
      passwordConfirm: {
        type: String,
        required: true,
        validate: {
          validator: function (this: IUserSchema, el: string): boolean {
            return el === this.password;
          },
          message: 'Passwords are not the same!',
        },
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
      active: {
        type: Boolean,
        default: true,
        select: false,
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
      this.passwordConfirm = undefined;
    });

    // Not show inactive
    this.schema.pre<Model<IUserSchema>>(/^find/, function (
      next: HookNextFunction
    ) {
      this.find({ active: { $ne: false } });
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
    return mongoose.model<IUserSchema>('User', this.schema);
  }
}

export default new UserModel().model;
