import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export default class CreateUserRequest {
  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  username: string = '';

  @MinLength(8)
  password: string = '';
}
