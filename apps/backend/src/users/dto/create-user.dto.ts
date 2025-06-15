import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';

export enum UserRole {
  BLUE_COLLAR = 'blue-collar',
  GREY_COLLAR = 'grey-collar',
  WHITE_COLLAR = 'white-collar',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
} 