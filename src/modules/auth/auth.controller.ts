import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthorizedUser } from '../../common/decorators/authorizedUser';
import { Public } from '../../common/decorators/public';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt';
import { LocalAuthGuard } from './guards/local';
import { ValidatedUser } from './types';
import { Token } from '../models/token/token.model';
import { User } from '../models/user/user.model';
import { DeleteResult } from 'mongodb';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@AuthorizedUser() user: ValidatedUser): Promise<Token> {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@AuthorizedUser() user: ValidatedUser): Promise<DeleteResult> {
    return this.authService.logout(user.userId);
  }
}
