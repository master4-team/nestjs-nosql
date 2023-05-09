import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/roles';
import { ValidatedUser } from '../../auth/auth.types';
import { ParsedFilterQuery } from '../../filter/filter.types';
import { CrudDto } from './crud.dto';
import { CrudService } from './crud.service';
import { Crud } from './crud.model';
import { DeleteResult } from 'mongodb';
import { Filter } from '../../../common/decorators/filter';

@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Roles(Role.ADMIN)
  @Get('all')
  async findAll(@Filter() filter: ParsedFilterQuery<Crud>): Promise<Crud[]> {
    return await this.crudService.find(filter);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findByUserId(
    @AuthorizedUser() user: ValidatedUser,
    @Filter() filter: ParsedFilterQuery<Crud>,
  ): Promise<Crud[]> {
    return await this.crudService.findByUserId(user.userId, filter);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.crudService.findById(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(
    @AuthorizedUser() user: ValidatedUser,
    @Body() createDto: CrudDto,
  ): Promise<Crud> {
    return await this.crudService.create({ ...createDto, userId: user.userId });
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: CrudDto,
  ): Promise<Crud> {
    return await this.crudService.updateById(id, updateDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.crudService.deleteById(id);
  }
}
