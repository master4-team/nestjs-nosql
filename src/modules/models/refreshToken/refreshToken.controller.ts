import { Body, Controller, Delete, Headers, Post } from '@nestjs/common';
import { SkipJwtGuard } from '../../../common/decorators/skipJwtGuard';
import { Role, Roles } from '../../../common/decorators/roles';
import { RefreshTokenDto, RevokeRefreshTokenDto } from './refreshToken.dto';
import { RefreshTokenService } from './refreshToken.service';
import { RefreshTokenPayload, RevokeTokenPayload } from './refreshToken.types';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @SkipJwtGuard()
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshTokenDto,
    @Headers('authorization') authorization: string,
  ): Promise<RefreshTokenPayload> {
    return await this.refreshTokenService.refresh(
      authorization.split(' ')[1],
      body.refreshToken,
    );
  }

  @Roles(Role.ADMIN)
  @Delete('revoke')
  async revokeToken(
    @Body() body: RevokeRefreshTokenDto,
  ): Promise<RevokeTokenPayload> {
    return await this.refreshTokenService.revoke(body.userId);
  }
}
