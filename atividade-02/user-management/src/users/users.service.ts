import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Maria' }
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  create(user: { name: string }) {
    const newUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userUpdates: { name: string }) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return `Usuário com ID ${id} não encontrado`;
    }
    this.users[userIndex] = { ...this.users[userIndex], ...userUpdates };
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return `Usuário com ID ${id} não encontrado`;
    }
    this.users.splice(userIndex, 1);
    return `Usuário com ID ${id} removido com sucesso`;
  }
}