import {
  IsString,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string válida.' })
  name!: string;

  @IsInt({ message: 'A idade deve ser um número inteiro.' })
  @Min(18, { message: 'A idade mínima é 18 anos.' })
  @Max(100, { message: 'A idade máxima é 100 anos.' })
  @Type(() => Number)
  age!: number;

  @ValidateNested({ message: 'O endereço deve ser um objeto válido.' })
  @Type(() => AddressDto)
  address!: AddressDto;
}
