import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/roles';
import { ParsedFilterQuery } from '../../filter/types';
import { ValidatedUser } from '../../auth/types';
import { ChangePasswordDto, UpdateUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './user.model';
import { Filter } from '../../../common/decorators/filter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserDto,
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [UserDto],
  })
  @Roles(Role.ADMIN)
  @Get()
  async findUsers(@Filter() filter: ParsedFilterQuery<User>): Promise<User[]> {
    return await this.userService.find(filter);
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserDto,
  })
  @Roles(Role.USER, Role.ADMIN)
  @Get('me')
  async getProfile(@AuthorizedUser() user: ValidatedUser): Promise<User> {
    return await this.userService.findById(user.userId);
  }

  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: UserDto,
  })
  @Roles(Role.USER, Role.ADMIN)
  @Put('me/profile')
  async updateById(
    @AuthorizedUser() user: ValidatedUser,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateById(user.userId, updateDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: UserDto,
  })
  @Roles(Role.USER, Role.ADMIN)
  @Put('me/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ): Promise<User> {
    return await this.userService.changePassword(id, body);
  }
}
