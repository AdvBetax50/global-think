import { Inject, Injectable, BadRequestException,
  NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getKeys(): Promise<Array<number> | null> {
    return await this.cacheManager.get('keys');
  }

  async set(key: string, value: any, newKey: boolean = false): Promise<void> {
    await this.cacheManager.set(key, value, 0);
    if (newKey) {
      const keys: Array<number> = await this.cacheManager.get('keys');
      keys.push(+key);
      await this.cacheManager.set('keys', keys, 0);
    }
  }

  async get(key: string): Promise<CreateUserDto> {
    return await this.cacheManager.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
    const keys: Array<number> = await this.cacheManager.get('keys');
    const index = keys.findIndex(element => element === +key); // Check if the element was found
    if (index !== -1) {
      keys.splice(index, 1);
    }
    await this.cacheManager.set('keys', keys, 0);
  }

  async createExampleUsers() {
    const users: CreateUserDto[] = [
      { id: 1, name: 'Alvaro Alcantara', email: 'alvaro@example.com', age: 20, profile: { username: 'aalcantara'} },
      { id: 2, name: 'Beto Beto', email: 'beto@example.com', age: 21, profile: { username: 'bbeto'} },
      { id: 3, name: 'Carlos Correa', email: 'carlos@example.com', age: 22, profile: { username: 'ccorrea' } },
      { id: 4, name: 'Daniel Danz', email: 'daniel@example.com', age: 23, profile: { username: 'ddanz' } },
      { id: 5, name: 'Elvio Enrique', email: 'elvio@example.com', age: 24, profile: { username: 'eenrique' } },
    ];

    try {
      for (const user of users) {
        await this.set(user.id.toString(), user);
      }
      // save ids of examples
      await this.set('keys', [1,2,3,4,5]);
    }
    catch(error) {
      console.error(`Error at creating new users: ${error}`);
    }
  }

  async isMailDuplicated(email: string): Promise<{duplicated: boolean, id?: number}> {
    const { users } = await this.findAll();
    users.forEach((u) => {
      if (u.email === email) {
        return { duplicated: true, id: u.id };
      }
    });
    return { duplicated: false };
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    try {
      const { duplicated, id } = await this.isMailDuplicated(user.email);
      if (duplicated) {
        throw new BadRequestException('Error at creating a new user, email is duplicated.');
      }
      await this.set(user.id.toString(), user, true);
      return user;
    }
    catch (error) {
      console.log('error = ', error)
      throw new InternalServerErrorException('Error at creating a new user.');
    }
  }

  async findAll() {
    try {
      const keys = await this.getKeys();
      const userPromises = keys.map(async (key) => {
        const user: CreateUserDto = await this.get(key.toString());
        return user;
      });
      const users = await Promise.all(userPromises);
      return { users };
    }
    catch (error) {
      throw new InternalServerErrorException('Error at fetching users');
    }
  }

  async findOne(id: number) {
    try {
      const user: CreateUserDto = await this.get(id.toString());
      return { user };
    }
    catch (error) {
      throw new InternalServerErrorException(`Error at fetching user with id: ${id}`);
    }
  }

  async update(updatedUser: UpdateUserDto) {
    try {
      const { duplicated, id } = await this.isMailDuplicated(updatedUser.email);
      if (duplicated && id !== updatedUser.id) {
        throw new BadRequestException('Error at creating a new user, email is duplicated.');
      }
      const user = await this.get(updatedUser.id.toString());
      const update: CreateUserDto = {
        id: updatedUser.id,
        name: updatedUser.name ?? user.name,
        email: updatedUser.email ?? user.email,
        age: updatedUser.age ?? user.age,
        profile: updatedUser.profile ?? user.profile,
      }
      await this.set(updatedUser.id.toString(), update);
      return { user: update };
    }
    catch (error) {
      throw new InternalServerErrorException(`Error at updating user with id: ${updatedUser.id}`);
    }
  }

  async remove(id: number) {
    try {
      await this.delete(id.toString());
      return;
    }
    catch (error) {
      throw new InternalServerErrorException(`Error at removing user with id: ${id}`);
    }
  }
}
