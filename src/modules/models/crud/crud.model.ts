import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { LeanModel } from '../../../common/types';
import { BaseModel, BaseSchema, getSchemaOptions } from '../../base/base.model';
import { createRelation } from '../../database/plugins/relation';
import { UserModel } from '../user/user.model';

export type CrudDocument = HydratedDocument<CrudModel>;
export type Crud = LeanModel<CrudDocument>;

@Schema(getSchemaOptions({ collection: 'crud' }))
export class CrudModel extends BaseModel {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    type: ObjectId,
    ref: UserModel.name,
    autopopulate: { select: '_id name username phone email role' },
  })
  user?: UserModel;
}

export const CrudSchema =
  SchemaFactory.createForClass(CrudModel).add(BaseSchema);

CrudSchema.plugin(createRelation, { path: 'userId', ref: 'user' });
