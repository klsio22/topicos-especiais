import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Get('perfil')
  @Roles('USER')
  getUserPerfil(@Req() req: Request & { user?: AuthenticatedUser }) {
    const user = req.user;
    const response = {
      message: 'Perfil do usuário USER',
      user,
    };
    return response;
  }
}
