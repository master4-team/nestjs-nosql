import { Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import { mongooseLeanGetters } from 'mongoose-lean-getters';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';
import { Property } from '../../common/decorators/property';

export const getSchemaOptions = (schemaOptions: SchemaOptions = {}) => {
  const options: SchemaOptions = {
    timestamps: true,
    ...schemaOptions,
  };
  return options;
};

@Schema(getSchemaOptions())
export class BaseModel extends Document {
  @Property({ required: false, type: SchemaTypes.ObjectId, auto: true })
  _id?: string;

  @Property({ required: false })
  createdAt?: Date;

  @Property({ required: false })
  updatedAt?: Date;
}

export const BaseSchema = SchemaFactory.createForClass(BaseModel);

mongoose.plugin(mongooseLeanVirtuals);
mongoose.plugin(mongooseLeanDefaults);
mongoose.plugin(mongooseLeanGetters);
// eslint-disable-next-line @typescript-eslint/no-var-requires
mongoose.plugin(require('mongoose-autopopulate'));
