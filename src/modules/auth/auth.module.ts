import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../user/user.repository';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
            expiresIn: 3600,
        },
    }),
    ],
    providers: [AuthService, JwtStrategy, { provide: UserRepository, useClass: UserRepository }],
    exports: [PassportModule, AuthService],
})
export class AuthModule {}