import { IsEmail, IsEnum, MinLength, IsNotEmpty } from 'class-validator';

export enum roleEnum {
  user = 'user',
  guide = 'guide',
  leadGuide = 'lead-guide',
  admin = 'admin'
}

export default class CreateUserRequest {
  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  email: string = '';

  @MinLength(8)
  password: string = '';

  @IsEnum(roleEnum)
  role: string = '';
}
