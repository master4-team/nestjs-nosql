import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../models/user/user.module';
import { LocalStrategy } from './strategies/localStrategy';
import { JwtStrategy } from './strategies/jwtStrategy';
import { EncryptionAndHashModule } from '../encryptionAndHash/encryptionAndHash.module';
import { AuthController } from './auth.controller';
import { TokenJwtModule } from '../jwt/token.jwt.module';
import { JwtAuthGuard } from './guards/jwt';
import { LocalAuthGuard } from './guards/local';
import { RoleGuard } from './guards/role';
import { RefreshTokenModule } from '../models/refreshToken/refreshToken.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RefreshTokenModule,
    TokenJwtModule,
    EncryptionAndHashModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    RoleGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
