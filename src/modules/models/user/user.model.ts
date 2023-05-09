import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/decorators/roles';
import { LeanModel } from '../../../common/types';
import { BaseModel, BaseSchema, getSchemaOptions } from '../../base/base.model';

export type UserDocument = HydratedDocument<UserModel>;
export type User = LeanModel<UserDocument>;

@Schema(getSchemaOptions({ collection: 'user' }))
export class UserModel extends BaseModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, unique: true, sparse: true })
  email?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, apiProperty: { enable: false } })
  password: string;

  @Prop({ required: true, unique: true, type: String, enum: Role })
  role: Role;
}

export const UserSchema =
  SchemaFactory.createForClass(UserModel).add(BaseSchema);
