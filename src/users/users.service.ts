import { Inject, Injectable, BadRequestException,
  NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  // keys is an array with all ids of the current users stored in the cache
  async getKeys(): Promise<Array<number> | null> {
    return await this.cacheManager.get('keys');
  }

  // creates and saves a new user into cache
  async set(key: string, value: any, newKey: boolean = false): Promise<void> {
    await this.cacheManager.set(key, value, 0);
    if (newKey) {
      const keys: Array<number> = await this.cacheManager.get('keys');
      keys.push(+key);
      await this.cacheManager.set('keys', keys, 0);
    }
  }

  // gets any information from cache
  async get(key: string): Promise<CreateUserDto> {
    return await this.cacheManager.get(key);
  }

  // deletes from cache
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);

    // this is to delete the user from the user id array (keys)
    const keys: Array<number> = await this.cacheManager.get('keys');
    const index = keys.findIndex(element => element === +key);
    if (index !== -1) {
      keys.splice(index, 1);
    }
    await this.cacheManager.set('keys', keys, 0);
  }

  // creates some users when app is started
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
      // save user ids of examples
      await this.set('keys', [1,2,3,4,5]);
    }
    catch(error) {
      console.error(`Error at creating new users: ${error}`);
    }
  }

  // verifies if mail is already stored in cache
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
      // mail could be 'duplicated' if passed with same user.email
      // in this case we check if its the same id of the user too.
      const { duplicated, id } = await this.isMailDuplicated(updatedUser.email);
      if (duplicated && id !== updatedUser.id) {
        throw new BadRequestException('Error at creating a new user, email is duplicated.');
      }
      const user = await this.get(updatedUser.id.toString());
      // returns new user with all its info.
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

  async remove(id: number): Promise<CreateUserDto> {
    try {
      const user = await this.get(id.toString());
      await this.delete(id.toString());
      return user;
    }
    catch (error) {
      throw new InternalServerErrorException(`Error at removing user with id: ${id}`);
    }
  }
}
