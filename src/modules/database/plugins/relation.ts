import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export type RelationPluginOptions = {
  path: string;
  ref: string;
};

export function createRelation(schema: Schema, options: RelationPluginOptions) {
  // Add a pre-save hook to convert the userId to an ObjectId
  function preSave(next: () => void) {
    if (typeof this[options.path] === 'string') {
      this[options.ref] = new ObjectId(this[options.path]);
    }
    next();
  }

  schema.pre('save', preSave);
}
