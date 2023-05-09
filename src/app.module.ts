import {
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorFilter } from './common/filters/error';
import { CorrelationIdMiddleware } from './common/middlewares/correlationId';
import { ConfigModule } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/models/user/user.module';
import { TokenJwtModule } from './modules/jwt/token.jwt.module';
import { RefreshTokenJwtModule } from './modules/jwt/refreshToken.jwt.module';
import { TransformResponseInterceptor } from './common/interceptors/response';
import { DatabaseModule } from './modules/database';
import { EncryptionAndHashModule } from './modules/encryptionAndHash/encryptionAndHash.module';
import { RequestContextMiddleware } from './common/middlewares/context/contextMiddleware';
import { RoleGuard } from './modules/auth/guards/role';
import { JwtAuthGuard } from './modules/auth/guards/jwt';
import { LoggerModule } from './modules/logger/logger.module';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exceptions';
import { FilterModule } from './modules/filter/filter.module';
import { LoggingInterceptor } from './common/interceptors/logging';
import { HealthModule } from './modules/health/health.module';
import { FilterQueryMiddleware } from './common/middlewares/filterQuery';
import { CrudModule } from './modules/models/crud/crud.module';
import { RefreshTokenModule } from './modules/models/refreshToken/refreshToken.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TokenJwtModule,
    RefreshTokenJwtModule,
    UserModule,
    AuthModule,
    RefreshTokenModule,
    EncryptionAndHashModule,
    LoggerModule,
    FilterModule,
    HealthModule,
    CrudModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          exceptionFactory: (errors: ValidationError[]) =>
            new ValidationException(errors, HttpStatus.BAD_REQUEST),
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer
      .apply(FilterQueryMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
