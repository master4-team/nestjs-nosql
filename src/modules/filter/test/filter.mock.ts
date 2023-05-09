import { FilterRequestQuery, ParsedFilterQuery } from '../filter.types';
import { DateTime } from 'luxon';

const date1 = DateTime.now().toISO();
const date2 = DateTime.now().toISO();

const mockFilterQuery: FilterRequestQuery = {
  filter: {
    field1: 'value1',
    field2: {
      in: ['value1', 'value2'],
      nin: ['value3', 'value4'],
      gt: 'value5',
      lt: 'value6',
      gte: date1,
      lte: date2,
      like: 'value7',
      ne: 'value8',
    },
    or: [
      {
        field3: 'value1',
      },
      {
        'field4.subField4': {
          in: ['value2', 'value3'],
        },
      },
    ],
  },
  limit: '10',
  skip: '0',
  sort: {
    field1: 'asc',
  },
  select: {
    field1: '1',
    field2: '0',
  },
};

const mockParsedFilterQuery: ParsedFilterQuery<Record<string, any>> = {
  filter: {
    field1: 'value1',
    field2: {
      $in: ['value1', 'value2'],
      $nin: ['value3', 'value4'],
      $gt: 'value5',
      $lt: 'value6',
      $gte: DateTime.fromISO(date1).toJSDate(),
      $lte: DateTime.fromISO(date2).toJSDate(),
      $regex: /value7/,
      $options: 'i',
      $ne: 'value8',
    },
    $or: [
      { field3: 'value1' },
      {
        'field4.subField4': {
          $in: ['value2', 'value3'],
        },
      },
    ],
  },
  limit: 10,
  skip: 0,
  sort: {
    field1: 1,
  },
  projections: {
    field1: 1,
    field2: 0,
  },
};

export { mockFilterQuery, mockParsedFilterQuery, date1, date2 };
