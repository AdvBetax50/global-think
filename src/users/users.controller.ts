import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponse, ErrorResponse } from '@common/responses';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger('Users');
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async create(@Body() user: CreateUserDto) {
    try {
      const data = await this.usersService.create(user);
      return new SuccessResponse(data,);
    }
    catch (error: any) {
      this.logger.error(error?.message);
      return new ErrorResponse(error?.status, error?.response?.message);
    }
  }

  @Get()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async findAll() {
    try {
      const data = await this.usersService.findAll();
      return new SuccessResponse(data);
    }
    catch (error: any) {
      this.logger.error(error?.message);
      return new ErrorResponse(error?.status, error?.response?.message);
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    try {
      if (!id) throw new BadRequestException('Invalid Id');
      const data = await this.usersService.findOne(+id);
      return new SuccessResponse(data);
    }
    catch (error: any) {
      this.logger.error(error?.message);
      return new ErrorResponse(error?.status, error?.response?.message);
    }
  }

  @Patch(':id')
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      if (!id) throw new BadRequestException('Invalid Id');
      const data = await this.usersService.update(updateUserDto);
      return new SuccessResponse(data);
    }
    catch (error: any) {
      this.logger.error(error?.message);
      return new ErrorResponse(error?.status, error?.response?.message);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async remove(@Param('id') id: string) {
    try {
      if (!id) throw new BadRequestException('Invalid Id');
      const data = await this.usersService.remove(+id);
      return new SuccessResponse(data, 200, 'User deleted succesfully.');
    }
    catch (error: any) {
      this.logger.error(error?.message);
      return new ErrorResponse(error?.status, error?.response?.message);
    }
  }
}
