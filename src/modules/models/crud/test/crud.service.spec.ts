import { Test, TestingModule } from '@nestjs/testing';
import { CrudService } from '../crud.service';
import { CrudPayload } from '../crud.types';
import { mockCrudPayload, userId } from './crud.mock';
import { mockRepository } from '../../../database/test/database.service.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getModelToken } from '@nestjs/mongoose';
import { CrudModel } from '../crud.model';

const moduleMocker = new ModuleMocker(global);

describe('CrudService', () => {
  let crudService: CrudService;

  let crudPayload: CrudPayload;

  beforeEach(async () => {
    crudPayload = { ...mockCrudPayload };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CrudService,
        {
          provide: getModelToken(CrudModel.name),
          useValue: mockRepository,
        },
      ],
    })
      .useMocker((target) => {
        if (typeof target === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            target,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    crudService = app.get<CrudService>(CrudService);
  });

  it('should be defined', () => {
    expect(crudService).toBeDefined();
  });

  describe('findByUserId', () => {
    it.each([{}, { filter: { displayName: 'displayName' } }])(
      'should return crud payload',
      async (item) => {
        jest.spyOn(crudService, 'find').mockResolvedValue([crudPayload]);

        expect(
          await crudService.findByUserId(userId, { ...item }),
        ).toStrictEqual([crudPayload]);
        if (!item.filter) {
          expect(crudService.find).toHaveBeenCalledWith({
            filter: { userId },
          });
        } else {
          expect(crudService.find).toHaveBeenCalledWith({
            filter: { userId, displayName: 'displayName' },
          });
        }
      },
    );
  });
});
