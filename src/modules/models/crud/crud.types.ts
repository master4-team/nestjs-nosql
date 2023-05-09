import { DeleteResult } from 'mongodb';
import { Crud } from './crud.model';

export type CrudPayload = Crud;
export type CrudDeletePayload = DeleteResult;
