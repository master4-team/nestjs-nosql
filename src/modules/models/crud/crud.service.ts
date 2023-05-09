import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../base/base.service';
import { Crud, CrudDocument, CrudModel } from './crud.model';
import { ParsedFilterQuery } from '../../filter/filter.types';
import { CrudPayload } from './crud.types';

@Injectable()
export class CrudService extends BaseService<CrudDocument, Crud> {
  constructor(
    @InjectModel(CrudModel.name)
    private readonly crudModel: Model<CrudDocument>,
  ) {
    super(crudModel);
  }

  async findByUserId(
    userId: string,
    filter: ParsedFilterQuery<Crud>,
  ): Promise<CrudPayload[]> {
    const _filter = filter.filter || {};
    _filter.userId = userId;
    filter.filter = _filter;

    return await this.find(filter);
  }
}
