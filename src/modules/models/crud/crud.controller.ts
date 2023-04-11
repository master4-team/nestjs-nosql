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
import { ValidatedUser } from '../../auth/types';
import { ParsedFilterQuery } from '../../filter/types';
import {
  CrudCreateDto,
  CrudDeleteReponseDto,
  CrudDto,
  CrudUpdateDto,
} from './crud.dto';
import { CrudService } from './crud.service';
import { ApiResponse } from '@nestjs/swagger';
import { Crud } from './crud.model';
import { DeleteResult } from 'mongodb';
import { Filter } from '../../../common/decorators/filter';

@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [CrudDto],
  })
  @Roles(Role.ADMIN)
  @Get('all')
  async findAll(@Filter() filter: ParsedFilterQuery<Crud>): Promise<Crud[]> {
    return await this.crudService.find(filter);
  }

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [CrudDto],
  })
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findByUserId(
    @AuthorizedUser() user: ValidatedUser,
    @Filter() filter: ParsedFilterQuery<Crud>,
  ): Promise<Crud[]> {
    return await this.crudService.find({
      ...filter,
      filter: { ...filter.filter, userId: user.userId },
    });
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CrudDto,
  })
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.crudService.findById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The created record',
    type: CrudDto,
  })
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(
    @AuthorizedUser() user: ValidatedUser,
    @Body() createDto: CrudCreateDto,
  ): Promise<Crud> {
    return await this.crudService.create({ ...createDto, userId: user.userId });
  }

  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: CrudDto,
  })
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: CrudUpdateDto,
  ): Promise<Crud> {
    return await this.crudService.updateById(id, updateDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The detele result',
    type: CrudDeleteReponseDto,
  })
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.crudService.deleteById(id);
  }
}
