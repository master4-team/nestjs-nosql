import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthorizedUser } from '../../common/decorators/authorizedUser';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local';
import { ValidatedUser } from './auth.types';
import { User } from '../models/user/user.model';
import { SkipJwtGuard } from '../../common/decorators/skipJwtGuard';
import { RefreshTokenPayload } from '../models/refreshToken/refreshToken.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @SkipJwtGuard()
  @Post('login')
  async login(
    @AuthorizedUser() user: ValidatedUser,
  ): Promise<RefreshTokenPayload> {
    return this.authService.login(user);
  }

  @SkipJwtGuard()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }
}
