import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get('orders')
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('orders/:id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(+id);
  }

  @Get('customers/:customerId/orders')
  findByCustomer(
    @Param('customerId') customerId: string,
  ): Promise<Order[]> {
    return this.orderService.findByCustomer(+customerId);
  }
}
