import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Public } from '../../../common/decorators/public';
import { Role, Roles } from '../../../common/decorators/roles';
import {
  RefreshTokenDto,
  RevokeTokenDto,
  RevokeTokenResponse,
  TokenDto,
} from './token.dto';
import { TokenService } from './token.service';
import { ApiResponse } from '@nestjs/swagger';
import { Token } from './token.model';
import { DeleteResult } from 'mongodb';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: TokenDto,
  })
  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<Token> {
    return await this.tokenService.refresh(body.refreshToken);
  }

  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: RevokeTokenResponse,
  })
  @Roles(Role.ADMIN)
  @Delete('revoke')
  async revokeToken(@Body() body: RevokeTokenDto): Promise<DeleteResult> {
    return await this.tokenService.revoke(body.userId);
  }
}
