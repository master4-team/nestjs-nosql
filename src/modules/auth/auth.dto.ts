import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}
