import { FilterQuery } from 'mongoose';

// api GET /?type="filter"&filter={"field1":"value1","field2":{"in":["value1","value2"], "nin":["value4"], "ne":"value5","gt/gte/lt/lte":"value6", "like": "value7"},"or/nor":[{"field1":"value1","field2":"value2"}]}
//           &limit=10&skip=0&sort={"field1":"ASC","field2":"DESC"}&fields={"field1":1,"field2":0}

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

export type Sort<T> = {
  [P in keyof T]?: 1 | -1;
};

export type BaseFilter<T> = {
  [P in keyof T]?: FilterValue | FilterOperator;
};

export type Filter<T> = BaseFilter<T> & {
  or?: BaseFilter<T>[];
};

export type FilterRequestQuery = {
  type?: FilterType;
  filter?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  fields?: string;
};

export type Projections<T> = {
  [P in keyof T]?: 0 | 1;
};

export type ParsedFilterQuery<T> = {
  filter?: FilterQuery<T>;
  limit?: number;
  skip?: number;
  sort?: Sort<T>;
  projections?: Projections<T>;
};
