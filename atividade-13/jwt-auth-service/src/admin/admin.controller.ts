import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint de administração (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Acesso autorizado para ADMIN' })
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
  @ApiOperation({ summary: 'Lista de usuários (somente ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
  @ApiResponse({
    status: 403,
    description: 'Usuário sem permissão (não ADMIN)',
  })
  async getUsers() {
    const users = await this.adminService.getUsers();
    return {
      message: 'Lista de usuários (apenas para ADMINs)',
      users,
    };
  }
}
