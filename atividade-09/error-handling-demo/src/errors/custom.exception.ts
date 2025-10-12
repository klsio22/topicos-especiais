import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor() {
    super('Este é um erro personalizado', HttpStatus.BAD_REQUEST);
  }
}
