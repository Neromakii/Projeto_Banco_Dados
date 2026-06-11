import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
