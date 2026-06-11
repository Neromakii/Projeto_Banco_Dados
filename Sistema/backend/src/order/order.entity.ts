import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'confirmed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
