import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Customer } from '../customer/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { sessionId, customerId } = createOrderDto;

    const customer = await this.customerRepository.findOne({
      where: { id: customerId, active: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found or inactive');
    }

    const key = `cart:${sessionId}`;
    const itemsJson = await this.redis.hget(key, 'items');
    const cartItems = itemsJson ? JSON.parse(itemsJson) : [];

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    let total = 0;
    const orderItems: Partial<OrderItem>[] = cartItems.map((item: any) => {
      const itemTotal = Number(item.price) * Number(item.quantity);
      total += itemTotal;
      return {
        productId: item.productId,
        productName: item.name,
        productPrice: item.price,
        quantity: item.quantity,
      };
    });

    const order = this.orderRepository.create({
      customerId,
      total,
      status: 'confirmed',
      items: orderItems as OrderItem[],
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.redis.del(key);

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
    });
  }
}
