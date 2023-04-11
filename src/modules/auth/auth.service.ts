import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { FilterQuery } from 'mongoose';
import {
  ErrorMessageEnum,
  UNAUTHORIZED,
  USER_EXISTED,
} from '../../common/constants/errors';
import { Role } from '../../common/decorators/roles';
import { BusinessException } from '../../common/exceptions';
import { EncryptionAndHashService } from '../encryptionAndHash/encrypttionAndHash.service';
import { Token } from '../models/token/token.model';
import { TokenService } from '../models/token/token.service';
import { User } from '../models/user/user.model';
import { UserService } from '../models/user/user.service';
import { RegisterDto } from './auth.dto';
import { ValidatedUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser> {
    const user = await this.usersService.findOne({ filter: { username } });
    if (!user) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );
    }

    const isPasswordValid = await this.encryptionAndHashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );
    }
    return {
      username: user.username,
      userId: user._id,
      role: user.role,
    };
  }

  async validateAccessToken(accessToken: string): Promise<boolean> {
    return this.tokenService.verifyAccessToken(accessToken);
  }

  async login(loginDto: ValidatedUser): Promise<Token> {
    return await this.tokenService.createToken(loginDto);
  }

  async logout(userId: string): Promise<DeleteResult> {
    return await this.tokenService.revoke(userId);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, password } = registerDto;
    let filter: FilterQuery<User> = { username };
    if (email) {
      filter = { $or: [{ username }, { email }] };
    }
    const user = await this.usersService.findOne({ filter });
    if (user) {
      throw new BusinessException(USER_EXISTED, ErrorMessageEnum.userExisted);
    }
    const hashedPassword = await this.encryptionAndHashService.hash(password);

    return await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: Role.USER,
    });
  }
}
