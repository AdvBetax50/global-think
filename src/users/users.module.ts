import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
