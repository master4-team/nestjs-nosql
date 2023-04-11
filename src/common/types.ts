import { Document } from 'mongoose';

export type Response<T = Record<string, any>> = {
  statusCode: number;
  message: string;
  url: string;
  success: boolean;
  timestamp: string;
  correlationId?: string;
  data?: T;
  took: string;
};

export type LeanModel<T extends Document> = Omit<T, keyof Document> & {
  _id?: string;
};

export type GenericError = {
  code: string;
  statusCode: number;
  messages: Record<string, string>;
};
