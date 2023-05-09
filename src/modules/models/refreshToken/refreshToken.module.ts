import { Module } from '@nestjs/common';
import { RefreshTokenJwtModule } from '../../jwt/refreshToken.jwt.module';
import { TokenJwtModule } from '../../jwt/token.jwt.module';
import { RefreshTokenController } from './refreshToken.controller';
import { RefreshTokenService } from './refreshToken.service';
import { EncryptionAndHashModule } from '../../encryptionAndHash/encryptionAndHash.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenModel, RefreshTokenSchema } from './refreshToken.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
    TokenJwtModule,
    RefreshTokenJwtModule,
    EncryptionAndHashModule,
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
