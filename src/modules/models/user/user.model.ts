import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/decorators/roles';
import { LeanModel } from '../../../common/types';
import { BaseModel, BaseSchema, getSchemaOptions } from '../../base/base.model';
import { Property } from '../../../common/decorators/property';

export type UserDocument = HydratedDocument<UserModel>;
export type User = LeanModel<UserDocument>;

@Schema(getSchemaOptions({ collection: 'user' }))
export class UserModel extends BaseModel {
  @Property({ required: true })
  name: string;

  @Property({ required: false, unique: true, sparse: true })
  email?: string;

  @Property({ required: false })
  phone?: string;

  @Property({ required: true, unique: true })
  username: string;

  @Property({ required: true, apiProperty: { enable: false } })
  password: string;

  @Property({ required: true, unique: true, type: String, enum: Role })
  role: Role;
}

export const UserSchema =
  SchemaFactory.createForClass(UserModel).add(BaseSchema);
