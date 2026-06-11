import { IsString, IsNumber, IsOptional, IsObject, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
