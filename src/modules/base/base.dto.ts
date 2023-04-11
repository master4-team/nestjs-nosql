import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponse {
  @ApiProperty()
  deleteCount: number;

  @ApiProperty()
  acknowledged: boolean;
}
