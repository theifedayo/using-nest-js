import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtService]
})
export class AuthModule {}
