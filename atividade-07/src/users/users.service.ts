import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(user: Omit<User, 'id'>): Promise<User> {
    const dto = plainToInstance(CreateUserDto, user);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const collectMessages = (errs: import('class-validator').ValidationError[], out: string[]) => {
        errs.forEach((e) => {
          if (e.constraints) {
            Object.values(e.constraints).forEach((m) => out.push(m));
          }
          if (e.children && e.children.length > 0) {
            collectMessages(e.children, out);
          }
        });
      };

      const messages: string[] = [];
      collectMessages(errors, messages);
      throw new BadRequestException(messages);
    }

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
