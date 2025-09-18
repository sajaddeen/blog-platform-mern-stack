import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;


  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}