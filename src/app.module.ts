import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from './users/users.service';

@Module({
  imports: [UsersModule, CacheModule.register({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UsersService) {}

  async onModuleInit() {
    await this.userService.createExampleUsers();
  }
}
