import { Injectable } from '@nestjs/common';
import { FilterOperators } from 'mongodb';
import { FilterQuery, RegexOptions } from 'mongoose';
import {
  ErrorMessageEnum,
  INVALID_FILTER_QUERY,
} from '../../common/constants/errors';
import { BusinessException } from '../../common/exceptions';
import { LoggerService } from '../logger/logger.service';
import {
  BaseFilter,
  Filter,
  FilterOperator,
  FilterOperatorEnum,
  FilterRequestQuery,
  FilterValue,
  ParsedFilterQuery,
  Projections,
  Sort,
} from './types';
import getDateOrValue from '../../utils/getDateOrValue';

@Injectable()
export class FilterService {
  constructor(private readonly logger: LoggerService) {}

  parseFilterRequestQuery<T>(query: FilterRequestQuery): ParsedFilterQuery<T> {
    try {
      const parsedFilterQuery: ParsedFilterQuery<T> = {};
      if (query.filter) {
        parsedFilterQuery.filter = this.parseFilter(
          this.parseFilterFromQueryString<T>(query.filter),
        );
      }
      if (query.fields) {
        parsedFilterQuery.projections = this.parseProjectionFromQueryString<T>(
          query.fields,
        );
      }
      if (query.sort) {
        parsedFilterQuery.sort = this.parseSortFromQueryString<T>(query.sort);
      }
      if (query.limit) {
        parsedFilterQuery.limit = query.limit;
      }
      if (query.skip) {
        parsedFilterQuery.skip = query.skip;
      }
      return parsedFilterQuery;
    } catch (error) {
      this.logger.error_(
        'Failed to parse filter request query',
        error,
        FilterService.name,
      );
      throw new BusinessException(
        INVALID_FILTER_QUERY,
        ErrorMessageEnum.invalidFilter,
      );
    }
  }

  private convertOperator(
    key: FilterOperatorEnum,
    value: FilterValue | FilterValue[],
  ): FilterOperators<FilterValue> | RegexOptions {
    switch (key) {
      case FilterOperatorEnum.IN:
        return { $in: getDateOrValue(value as FilterValue[]) };
      case FilterOperatorEnum.NIN:
        return { $nin: getDateOrValue(value as FilterValue[]) };
      case FilterOperatorEnum.NE:
        return { $ne: getDateOrValue(value as FilterValue) };
      case FilterOperatorEnum.GT:
        return { $gt: getDateOrValue(value as FilterValue) };
      case FilterOperatorEnum.GTE:
        return { $gte: getDateOrValue(value as FilterValue) };
      case FilterOperatorEnum.LT:
        return { $lt: getDateOrValue(value as FilterValue) };
      case FilterOperatorEnum.LTE:
        return { $lte: getDateOrValue(value as FilterValue) };
      case FilterOperatorEnum.LIKE:
        return { $regex: /value/, $options: 'i' };
      default:
        return { key: getDateOrValue(value) };
    }
  }

  private parseOperator(
    filterOperator: FilterOperator,
  ): FilterOperators<FilterValue> | RegexOptions {
    const operators = {};
    for (const operator in filterOperator) {
      Object.assign(
        operators,
        this.convertOperator(
          operator as FilterOperatorEnum,
          filterOperator[operator],
        ),
      );
    }
    return operators;
  }

  private parseBaseFilter<T>(filter: BaseFilter<T>): FilterQuery<T> {
    const parsedBaseFilter: FilterQuery<T> = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        parsedBaseFilter[key as keyof T] = this.parseOperator(
          filter[key] as FilterOperator,
        ) as FilterQuery<T>[keyof T];
      } else {
        parsedBaseFilter[key] = getDateOrValue(filter[key]);
      }
    }
    return parsedBaseFilter;
  }

  private parseFilterFromQueryString<T>(filter: string): Filter<T> {
    return JSON.parse(filter) as Filter<T>;
  }

  private parseFilter<T>(filter: Filter<T>): FilterQuery<T> {
    const parsedFilter: FilterQuery<T> = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if (key === 'or' || key === 'nor') {
          parsedFilter[`$${key}`] = filter[key].map((item: BaseFilter<T>) => {
            return this.parseBaseFilter(item);
          });
        } else {
          parsedFilter[key as keyof T] = this.parseOperator(
            filter[key],
          ) as FilterQuery<T>[keyof T];
        }
      } else {
        parsedFilter[key as keyof T] = getDateOrValue(
          filter[key],
        ) as FilterQuery<T>[keyof T];
      }
    }
    return parsedFilter;
  }

  private parseProjectionFromQueryString<T>(
    projections: string,
  ): Projections<T> {
    return JSON.parse(projections);
  }

  private parseSortFromQueryString<T>(sort: string): Sort<T> {
    const parsed = JSON.parse(sort);
    return Object.keys(parsed).reduce((acc, key) => {
      acc[key] = (parsed[key] as string).toUpperCase() === 'ASC' ? 1 : -1;
      return acc;
    }, {});
  }
}
