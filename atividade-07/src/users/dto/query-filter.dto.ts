import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryFilterDto {
  @IsOptional()
  @IsString({ message: 'O filtro deve ser uma string válida.' })
  @Transform(({ value }: { value: string }) => value?.trim())
  filter?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number;
}
