import { Controller, Post, Body, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.services';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() userDto: UserRegisterDto): Promise<void> {
    return this.authService.signUp(userDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    let user = await this.userService.findOneByUsername(req.user.username)
    return this.authService.login(user);
  }
}
