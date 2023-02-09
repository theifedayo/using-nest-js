import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.services';


@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UserService, { provide: UserRepository, useClass: UserRepository }],
    exports: [UserService],
})
  
export class UserModule {}