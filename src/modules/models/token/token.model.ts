import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { LeanModel } from '../../../common/types';
import { BaseModel, BaseSchema, getSchemaOptions } from '../../base/base.model';
import { createRelation } from '../../database/plugins/relation';
import { UserModel } from '../user/user.model';
import { Property } from '../../../common/decorators/property';

export type TokenDocument = HydratedDocument<TokenModel>;
export type Token = LeanModel<TokenDocument>;

@Schema(getSchemaOptions({ collection: 'token' }))
export class TokenModel extends BaseModel {
  @Property({ required: true })
  accessToken: string;

  @Property({ required: true })
  refreshToken: string;

  @Property({ required: true, unique: true })
  userId: string;

  @Property({
    type: ObjectId,
    ref: UserModel.name,
    autopopulate: { select: '_id name username phone email role' },
  })
  user?: UserModel;

  @Property({ required: true })
  refreshExpiresIn: Date;
}

export const TokenSchema =
  SchemaFactory.createForClass(TokenModel).add(BaseSchema);

TokenSchema.plugin(createRelation, { path: 'userId', ref: 'user' });
