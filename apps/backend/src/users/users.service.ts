import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    // In a real app, this would save to a database
    // and return a user object without the password
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  login(loginUserDto: LoginUserDto) {
    // In a real app, this would find a user,
    // validate the password, and return a JWT
    console.log(loginUserDto);
    return 'This action logs in a user';
  }
}
