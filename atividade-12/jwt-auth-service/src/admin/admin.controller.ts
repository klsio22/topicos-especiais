import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('ADMIN')
  getAdminData(
    @Req()
    req: Request & { user?: { id: number; email: string; role: string } },
  ) {
    return {
      message: 'Bem-vindo, Admin!',
      user: req.user,
    };
  }

  @Get('users')
  @Roles('ADMIN')
  getUsers() {
    return {
      message: 'Lista de usuários (apenas para ADMINs)',
      users: [],
    };
  }
}
