import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './modules/user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { AppMiddleware } from './app.middleware';
import { typeOrmConfig } from './config/typeorm.config';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { UserService } from './modules/user/user.services';


@Module({

  imports: [
    AuthModule, UserModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService],
})
export class AppModule {}
