import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const created = await this.prisma.user.create({ data });
    return created as unknown as User;
  }

  async findAll(): Promise<User[]> {
    const list = await this.prisma.user.findMany();
    return list as unknown as User[];
  }

  async findOne(id: number): Promise<User | null> {
    const found = await this.prisma.user.findUnique({ where: { id } });
    return found as unknown as User | null;
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    const updated = await this.prisma.user.update({ where: { id }, data });
    return updated as unknown as User;
  }

  async remove(id: number): Promise<User> {
    const removed = await this.prisma.user.delete({ where: { id } });
    return removed as unknown as User;
  }
}
