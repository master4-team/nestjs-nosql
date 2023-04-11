import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/logger.service';
import { Crud, CrudDocument, CrudModel } from './crud.model';

@Injectable()
export class CrudService extends BaseService<
  LoggerService,
  CrudDocument,
  Crud
> {
  constructor(
    @InjectModel(CrudModel.name)
    private readonly crudModel: Model<CrudDocument>,
    logger: LoggerService,
  ) {
    super(crudModel, logger);
  }
}
