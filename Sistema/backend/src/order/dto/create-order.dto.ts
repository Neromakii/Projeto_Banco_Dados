import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}
