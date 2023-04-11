import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenJwtModule } from '../../jwt/refreshToken.jwt.module';
import { TokenJwtModule } from '../../jwt/token.jwt.module';
import { TokenController } from './token.controller';
import { TokenModel, TokenSchema } from './token.model';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TokenModel.name, schema: TokenSchema }]),
    TokenJwtModule,
    RefreshTokenJwtModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
