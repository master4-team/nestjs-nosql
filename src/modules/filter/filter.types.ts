import { FilterQuery, ProjectionFields, SortOrder } from 'mongoose';

export enum FilterType {
  FILTER = 'filter',
  OTHER = 'other',
}

export type FilterValue = string | number | boolean;

export enum FilterOperatorEnum {
  IN = 'in',
  NIN = 'nin',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  // string only
  LIKE = 'like',
}

export type FilterOperator = {
  [key in FilterOperatorEnum]?: FilterValue | FilterValue[];
};

export type Sort = {
  [key: string]: 'ASC' | 'DESC' | 'asc' | 'desc';
};

export type Filter = {
  [key: string]: FilterValue | FilterOperator | Filter[];
};

export type FilterRequestQuery = {
  type?: FilterType;
  filter?: Filter;
  skip?: string;
  limit?: string;
  sort?: Sort;
  select?: SelectedFields;
};

export type SelectedFields = {
  [key: string]: '0' | '1';
};

export type ParsedFilterQuery<T> = {
  filter?: FilterQuery<T>;
  limit?: number;
  skip?: number;
  sort?: { [P in keyof T]?: SortOrder };
  projections?: ProjectionFields<T>;
};
