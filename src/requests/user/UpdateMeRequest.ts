import { IsEmail, IsNotEmpty } from 'class-validator';

export default class UpdateMeRequest {
  id: number = 0;

  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  email: string = '';
}
