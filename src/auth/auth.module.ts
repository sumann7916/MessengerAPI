import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UsersModule,
            PassportModule, 
            JwtModule.register({
              secret: JWT_SECRET,
              signOptions: {expiresIn: '1d'}
            })
          ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
