import { DeleteResult } from 'mongodb';
import { Role } from '../../src/common/decorators/roles';
import { LoginDto, RegisterDto } from '../../src/modules/auth/auth.dto';
import { ValidatedUser } from '../../src/modules/auth/types';
import {
  RefreshTokenDto,
  RevokeTokenDto,
} from '../../src/modules/models/token/token.dto';
import { Token } from '../../src/modules/models/token/token.model';
import { User } from '../../src/modules/models/user/user.model';

// Data input
const mockLoginDto: LoginDto = {
  username: 'test',
  password: 'test',
};

const mockRegisterDto: RegisterDto = {
  name: 'test',
  email: 'test@gmail.com',
  phone: '1234567890',
  username: 'test',
  password: 'test',
};

const mockRefreshTokenDto: RefreshTokenDto = {
  refreshToken: 'test',
};

const mockRevokeTokenDto: RevokeTokenDto = {
  userId: 'test',
};

const mockValidatedUser: ValidatedUser = {
  userId: 'test',
  username: 'test',
  role: Role.USER,
};

// Data output

const mockToken: Token = {
  accessToken: 'test',
  refreshToken: 'test',
  refreshExpiresIn: new Date(),
  userId: 'test',
};

const mockDeleteResult: DeleteResult = {
  deletedCount: 1,
  acknowledged: true,
};

const mockUser: User = {
  _id: 'test',
  name: 'test',
  email: 'test@gmail.com',
  phone: '1234567890',
  username: 'test',
  password: 'test',
  role: Role.USER,
};

export {
  mockLoginDto,
  mockRegisterDto,
  mockRefreshTokenDto,
  mockRevokeTokenDto,
  mockValidatedUser,
  mockToken,
  mockDeleteResult,
  mockUser,
};
