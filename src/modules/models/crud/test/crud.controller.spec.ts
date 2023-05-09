import { Test, TestingModule } from '@nestjs/testing';
import { CrudDto } from '../crud.dto';
import { CrudService } from '../crud.service';
import { CrudDeletePayload, CrudPayload } from '../crud.types';
import {
  mockCrudDeletePayload,
  mockCrudDto,
  mockCrudPayload,
} from './crud.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CrudController } from '../crud.controller';
import { ValidatedUser } from '../../../auth/auth.types';
import { mockValidatedUser } from '../../../auth/test/auth.mock';

const moduleMocker = new ModuleMocker(global);

describe('CrudController', () => {
  let crudService: CrudService;
  let crudController: CrudController;

  let crudPayload: CrudPayload;
  let crudDeletePayload: CrudDeletePayload;
  let crudDto: CrudDto;
  let validatedUser: ValidatedUser;

  beforeEach(async () => {
    crudPayload = { ...mockCrudPayload };
    crudDeletePayload = { ...mockCrudDeletePayload };
    crudDto = { ...mockCrudDto };
    validatedUser = { ...mockValidatedUser };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CrudController],
    })
      .useMocker((target) => {
        if (target === CrudService) {
          return {
            find: jest.fn().mockResolvedValue([crudPayload]),
            findByUserId: jest.fn().mockResolvedValue(crudPayload),
            findById: jest.fn().mockResolvedValue(crudPayload),
            create: jest.fn().mockResolvedValue(crudPayload),
            updateById: jest.fn().mockResolvedValue(crudPayload),
            deleteById: jest.fn().mockResolvedValue(crudDeletePayload),
          };
        }

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
    crudController = app.get<CrudController>(CrudController);
  });

  it('should be defined', () => {
    expect(crudController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return crud payloads', async () => {
      jest.spyOn(crudService, 'find').mockResolvedValue([crudPayload]);

      expect(await crudController.findAll({})).toStrictEqual([crudPayload]);

      expect(crudService.find).toHaveBeenCalledWith({});
    });
  });

  describe('findByUserId', () => {
    it('should return crud payloads', async () => {
      jest.spyOn(crudService, 'findByUserId').mockResolvedValue([crudPayload]);

      expect(
        await crudController.findByUserId(validatedUser, {}),
      ).toStrictEqual([crudPayload]);

      expect(crudService.findByUserId).toHaveBeenCalledWith(
        validatedUser.userId,
        {},
      );
    });
  });

  describe('findById', () => {
    it('should return crud payload', async () => {
      jest.spyOn(crudService, 'findById').mockResolvedValue(crudPayload);

      expect(await crudController.findById(crudPayload._id)).toStrictEqual(
        crudPayload,
      );

      expect(crudService.findById).toHaveBeenCalledWith(crudPayload._id);
    });
  });

  describe('create', () => {
    it('should return crud payload', async () => {
      jest.spyOn(crudService, 'create').mockResolvedValue(crudPayload);

      expect(await crudController.create(validatedUser, crudDto)).toStrictEqual(
        crudPayload,
      );

      expect(crudService.create).toHaveBeenCalledWith({
        ...crudDto,
        userId: validatedUser.userId,
      });
    });
  });

  describe('updateById', () => {
    it('should return crud payload', async () => {
      jest.spyOn(crudService, 'updateById').mockResolvedValue(crudPayload);

      expect(
        await crudController.updateById(crudPayload._id, crudDto),
      ).toStrictEqual(crudPayload);

      expect(crudService.updateById).toHaveBeenCalledWith(
        crudPayload._id,
        crudDto,
      );
    });
  });

  describe('delete', () => {
    it('should return crud payload', async () => {
      jest
        .spyOn(crudService, 'deleteById')
        .mockResolvedValue(crudDeletePayload);

      expect(await crudController.delete(crudPayload._id)).toStrictEqual(
        crudDeletePayload,
      );

      expect(crudService.deleteById).toHaveBeenCalledWith(crudPayload._id);
    });
  });
});
