import { IsNotEmpty, IsEmpty } from 'class-validator';

export default class UpdateUserRequest {
  @IsNotEmpty()
  name: string = '';
}
