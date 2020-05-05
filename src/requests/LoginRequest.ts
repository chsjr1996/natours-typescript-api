import { IsEmail, MinLength } from 'class-validator';

export default class LoginRequest {
  @IsEmail()
  email: string = '';

  @MinLength(8)
  password: string = '';
}
