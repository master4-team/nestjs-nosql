import { Role } from '../../common/decorators/roles';
import { DeepHideOrOmit } from '../../common/types';
import { RefreshTokenPayload } from '../models/refreshToken/refreshToken.types';
import { User } from '../models/user/user.model';

export type JwtPayload = {
  username: string;
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
};

export type ValidatedUser = {
  username: string;
  userId: string;
  role: Role;
};

export type LoginPayload = RefreshTokenPayload;

export type RegisterPayload = DeepHideOrOmit<User, 'password', true>;
