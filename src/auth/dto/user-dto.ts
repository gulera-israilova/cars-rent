import { IsEmail, IsString } from 'class-validator';

export class UserDto {


  @IsEmail()
  readonly email:string

  @IsString()
  password:string
}