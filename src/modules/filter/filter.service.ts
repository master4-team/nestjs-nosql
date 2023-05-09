import { HttpStatus, Injectable } from '@nestjs/common';
import { FilterOperators } from 'mongodb';
import {
  FilterQuery,
  ProjectionFields,
  RegexOptions,
  SortOrder,
} from 'mongoose';
import { BusinessException } from '../../common/exceptions';
import { LoggerService } from '../logger/logger.service';
import {
  Filter,
  FilterOperator,
  FilterOperatorEnum,
  FilterRequestQuery,
  FilterValue,
  ParsedFilterQuery,
  SelectedFields,
  Sort,
} from './filter.types';
import getDateOrValue from '../../utils/getDateOrValue';
import { ErrorMessageEnum } from '../../common/types';

@Injectable()
export class FilterService {
  constructor(private readonly logger: LoggerService) {}

  parseFilterRequestQuery<T>(query: FilterRequestQuery): ParsedFilterQuery<T> {
    try {
      const parsedFilterQuery: ParsedFilterQuery<T> = {};
      if (query.filter) {
        parsedFilterQuery.filter = this.parseFilter(query.filter);
      }
      if (query.select) {
        parsedFilterQuery.projections = this.parseProjection<T>(query.select);
      }
      if (query.sort) {
        parsedFilterQuery.sort = this.parseSort<T>(query.sort);
      }
      if (!isNaN(+query.limit)) {
        parsedFilterQuery.limit = +query.limit;
      }
      if (!isNaN(+query.skip)) {
        parsedFilterQuery.skip = +query.skip;
      }
      return parsedFilterQuery;
    } catch (error) {
      this.logger.error_(
        'Failed to parse filter request query',
        error,
        FilterService.name,
      );
      throw new BusinessException(
        ErrorMessageEnum.invalidFilter,
        HttpStatus.BAD_REQUEST,
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
        return { $regex: new RegExp(value as string), $options: 'i' };
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

  private parseBaseFilter<T>(filter: Filter): FilterQuery<T> {
    const parsedBaseFilter: FilterQuery<T> = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        parsedBaseFilter[key as keyof T] = this.parseOperator(
          filter[key] as FilterOperator,
        ) as FilterQuery<T>[keyof T];
      } else {
        parsedBaseFilter[key as keyof T] = getDateOrValue(filter[key]);
      }
    }
    return parsedBaseFilter;
  }

  private parseFilter<T>(filter: Filter): FilterQuery<T> {
    const parsedFilter: FilterQuery<T> = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if (key === 'or' && Array.isArray(filter[key])) {
          parsedFilter[`$${key}`] = (filter[key] as Filter[]).map(
            (item: Filter) => {
              return this.parseBaseFilter(item);
            },
          );
        } else {
          parsedFilter[key as keyof T] = this.parseOperator(
            filter[key] as FilterOperator,
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

  private parseProjection<T>(
    selectedFields: SelectedFields,
  ): ProjectionFields<T> {
    return Object.keys(selectedFields).reduce((acc, key) => {
      acc[key] = parseInt(selectedFields[key], 10);
      return acc;
    }, {});
  }

  private parseSort<T>(sort: Sort): { [P in keyof T]?: SortOrder } {
    return Object.keys(sort).reduce((acc, key) => {
      acc[key] = sort[key].toUpperCase() === 'ASC' ? 1 : -1;
      return acc;
    }, {});
  }
}
