import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../../generated/prisma';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Create narrow, typed aliases for Swagger decorators to avoid `no-unsafe-*`
const SafeApiTags = ApiTags as (...tags: string[]) => ClassDecorator;
const SafeApiOperation = ApiOperation as (
  options?: Record<string, unknown>,
) => MethodDecorator;
const SafeApiResponse = ApiResponse as (
  options: import('@nestjs/swagger').ApiResponseOptions,
) => MethodDecorator & ClassDecorator;
const SafeApiBody = ApiBody as (
  options: import('@nestjs/swagger').ApiBodyOptions,
) => MethodDecorator;
const SafeApiBearerAuth = ApiBearerAuth as (
  ...args: unknown[]
) => MethodDecorator;

@SafeApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SafeApiOperation({ summary: 'Registra um novo usuário' })
  @SafeApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SafeApiOperation({ summary: 'Realiza login com email e senha' })
  @SafeApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @SafeApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @SafeApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  @SafeApiBearerAuth()
  @SafeApiOperation({ summary: 'Retorna perfil do usuário autenticado' })
  @SafeApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  getPerfil(@Req() request: Request & { user?: User }) {
    return {
      message: 'Você acessou uma rota protegida!',
      user: request.user,
    };
  }
}
