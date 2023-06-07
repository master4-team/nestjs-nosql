import { EnvironmentEnum } from '../../common/types';

export default () => ({
  env: process.env.NODE_ENV || EnvironmentEnum.DEV,
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST,
  database: {
    mongo: { uri: process.env.MONGO_URI },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10),
  },
  encryptionAndHash: {
    encryptionSecret: process.env.ENCRYPTION_SECRET,
    hashSaltOrRound: parseInt(process.env.SALT_OR_ROUND, 10) || 10,
  },
});
