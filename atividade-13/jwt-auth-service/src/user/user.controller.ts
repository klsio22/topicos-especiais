import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Get('perfil')
  @Roles('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil do usuário (somente USER)' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  getUserPerfil(@Req() req: Request & { user?: AuthenticatedUser }) {
    const user = req.user;
    const response = {
      message: 'Perfil do usuário USER',
      user,
    };
    return response;
  }
}
