import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../../common/decorators/roles';
import { BusinessException } from '../../common/exceptions';
import { RegisterDto } from './auth.dto';
import { LoginPayload, RegisterPayload, ValidatedUser } from './auth.types';
import hideOrOmitFields from '../../utils/hideOrOmitFields';
import { ErrorMessageEnum } from '../../common/types';
import { UserService } from '../models/user/user.service';
import { RefreshTokenService } from '../models/refreshToken/refreshToken.service';
import { EncryptionAndHashService } from '../encryptionAndHash/encrypttionAndHash.service';
import { FilterQuery } from 'mongoose';
import { User } from '../models/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser> {
    const user = await this.usersService.findOne({ filter: { username } });
    if (!user) {
      throw new UnauthorizedException(ErrorMessageEnum.invalidCredentials);
    }

    const isPasswordValid = await this.encryptionAndHashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessageEnum.invalidCredentials);
    }
    return {
      username: user.username,
      userId: user._id,
      role: user.role,
    };
  }

  async login(validatedUser: ValidatedUser): Promise<LoginPayload> {
    return await this.refreshTokenService.createToken(validatedUser);
  }

  async register(registerDto: RegisterDto): Promise<RegisterPayload> {
    const { username, email, password } = registerDto;
    let filter: FilterQuery<User> = { username };
    if (email) {
      filter = { $or: [{ username }, { email }] };
    }
    const user = await this.usersService.findOne({ filter });
    if (user) {
      throw new BusinessException(
        ErrorMessageEnum.userExisted,
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await this.encryptionAndHashService.hash(password);

    const result = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: Role.USER,
    });

    return hideOrOmitFields(result, ['password'], true) as RegisterPayload;
  }
}
