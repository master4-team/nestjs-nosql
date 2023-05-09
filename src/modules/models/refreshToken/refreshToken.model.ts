import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, BaseSchema, getSchemaOptions } from '../../base/base.model';
import { ObjectId } from 'mongodb';
import { UserModel } from '../user/user.model';
import { createRelation } from '../../database/plugins/relation';
import { HydratedDocument } from 'mongoose';
import { LeanModel } from '../../../common/types';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenModel>;
export type RefreshToken = LeanModel<RefreshTokenDocument>;

@Schema(getSchemaOptions({ collection: 'refreshToken' }))
export class RefreshTokenModel extends BaseModel {
  @Prop()
  refreshToken: string;

  @Prop()
  iv: string;

  @Prop({ unique: true })
  userId: string;

  @Prop()
  refreshExpiresIn: Date;

  @Prop({
    type: ObjectId,
    ref: UserModel.name,
    autopopulate: { select: '_id name username phone email role' },
  })
  user?: UserModel;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel).add(BaseSchema);

RefreshTokenSchema.plugin(createRelation, { path: 'userId', ref: 'user' });
