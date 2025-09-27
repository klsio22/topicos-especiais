import { IsString } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'A cidade deve ser uma string válida.' })
  city!: string;

  @IsString({ message: 'O estado deve ser uma string válida.' })
  state!: string;
}
