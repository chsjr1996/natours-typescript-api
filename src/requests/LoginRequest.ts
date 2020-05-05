import { IsEmail, MinLength } from 'class-validator';

export default class LoginRequest {
  @IsEmail()
  username: string = '';

  @MinLength(8)
  password: string = '';
}
