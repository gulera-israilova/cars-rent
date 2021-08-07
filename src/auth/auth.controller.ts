import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  create(@Body() userDto: UserDto) {
    return this.authService.create(userDto)
  }

  @Post('signIn')
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto)
  }





}
