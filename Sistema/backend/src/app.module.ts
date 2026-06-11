import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { RedisModule } from './redis/redis.module';
import { Customer } from './customer/customer.entity';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { CustomerService } from './customer/customer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Customer, Order, OrderItem],
      synchronize: true,
    }),
    CustomerModule,
    ProductModule,
    CartModule,
    OrderModule,
    RedisModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly customerService: CustomerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding customers...');
    await this.customerService.create({ name: 'João Silva', email: 'joao@email.com', address: 'Rua A, 123' });
    await this.customerService.create({ name: 'Maria Souza', email: 'maria@email.com', address: 'Av B, 456' });
    await this.customerService.create({ name: 'Carlos Pereira', email: 'carlos@email.com', address: 'Rua C, 789' });
    this.logger.log('Customers seeded');
  }
}
