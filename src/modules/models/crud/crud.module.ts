import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterModule } from '../../filter/filter.module';
import { CrudController } from './crud.controller';
import { CrudModel, CrudSchema } from './crud.model';
import { CrudService } from './crud.service';

@Module({
  imports: [
    FilterModule,
    MongooseModule.forFeature([{ name: CrudModel.name, schema: CrudSchema }]),
  ],
  controllers: [CrudController],
  providers: [CrudService],
  exports: [CrudService],
})
export class CrudModule {}
