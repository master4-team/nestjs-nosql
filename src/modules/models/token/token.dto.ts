import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DeleteResponse } from '../../base/base.dto';
import { TokenModel } from './token.model';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RevokeTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class RevokeTokenResponse extends DeleteResponse {}
export class TokenDto extends TokenModel {}
