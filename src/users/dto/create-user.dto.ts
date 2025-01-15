import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  // TOOD: make this another dto?
  @ApiProperty()
  @IsNotEmptyObject()
  profile: Profile;
}

export interface Profile {
  username: string;
}