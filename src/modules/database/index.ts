import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongo.uri'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
