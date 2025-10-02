import { Controller, Get, Param, UseFilters, UseInterceptors, HttpException } from '@nestjs/common';
import { CustomExceptionFilter } from '../custom-exception.filter';
import { ResponseInterceptor } from '../response.interceptor';

@Controller('users')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  @Get()
  findAll() {
    return [{ id: 1, name: 'John Doe' }];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id !== '1') {
      throw new HttpException('Usuário não encontrado', 404);
    }
    return { id, name: 'John Doe' };
  }
}
