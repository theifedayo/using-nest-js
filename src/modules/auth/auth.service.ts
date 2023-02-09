import { Injectable } from '@nestjs/common';
import { UserRegisterDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.services';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: UserRegisterDto): Promise<void> {
    return this.userService.create(userDto);
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    // implementation for forgot password logic
  }

  async resetPassword(password: string, token: string): Promise<void> {
    // implementation for reset password logic
  }
}