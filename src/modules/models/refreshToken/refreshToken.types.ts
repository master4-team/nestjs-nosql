import { RefreshToken } from './refreshToken.model';

export type RefreshTokenPayload = RefreshToken & {
  accessToken: string;
};

export type RevokeTokenPayload = {
  refreshExpiresIn: Date;
};
