import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { SuccessResponse } from '@common/responses';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({
        isGlobal: true,
      })],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
    controller = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // test for get all users when running the app the first time
  describe('findAll', () => {
    it('should return an SuccesResponse with data being an array of users', async () => {
      const users: CreateUserDto[] = [
        { id: 1, name: 'Alvaro Alcantara', email: 'alvaro@example.com', age: 20, profile: { username: 'aalcantara'} },
        { id: 2, name: 'Beto Beto', email: 'beto@example.com', age: 21, profile: { username: 'bbeto'} },
        { id: 3, name: 'Carlos Correa', email: 'carlos@example.com', age: 22, profile: { username: 'ccorrea' } },
        { id: 4, name: 'Daniel Danz', email: 'daniel@example.com', age: 23, profile: { username: 'ddanz' } },
        { id: 5, name: 'Elvio Enrique', email: 'elvio@example.com', age: 24, profile: { username: 'eenrique' } },
      ];
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve({ users: users }));

      expect(await controller.findAll()).toStrictEqual(new SuccessResponse({ users: users }));
    });
  });

});
