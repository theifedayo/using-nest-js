import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService],
})
export class AppModule {}
