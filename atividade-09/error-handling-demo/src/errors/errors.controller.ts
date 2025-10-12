import { Controller, Get, Param, NotFoundException, BadRequestException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

@Controller('errors')
export class ErrorsController {
	@Get(':id')
	findOne(@Param('id') id: string) {
		if (id !== '1') {
			throw new NotFoundException('Recurso não encontrado');
		}
		return { id, message: 'Recurso encontrado' };
	}

	@Get('/bad-request')
	throwBadRequest() {
		throw new BadRequestException('Requisição inválida - parâmetros errados');
	}

	@Get('/forbidden')
	throwForbidden() {
		throw new ForbiddenException('Acesso proibido a este recurso');
	}

	@Get('/http-exception-simple')
	throwHttpExceptionSimple() {
		throw new HttpException('Acesso proibido', HttpStatus.FORBIDDEN);
	}

	@Get('/custom-error')
	throwCustomError() {
		throw new CustomException();
	}
}
