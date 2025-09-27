import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(filter?: string, page: number = 1): User[] {
    let result = this.users;

    if (filter) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    const pageSize = 5;
    return result.slice((page - 1) * pageSize, page * pageSize);
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }
}
