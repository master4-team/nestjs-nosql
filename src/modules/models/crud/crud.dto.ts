import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DeleteResponse } from '../../base/base.dto';
import { CrudModel } from './crud.model';

export class CrudCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;
}
export class CrudUpdateDto extends CrudCreateDto {}
export class CrudDeleteReponseDto extends DeleteResponse {}
export class CrudDto extends CrudModel {}
