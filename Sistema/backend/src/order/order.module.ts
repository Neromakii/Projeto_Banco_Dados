import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Customer } from '../customer/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Customer])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
