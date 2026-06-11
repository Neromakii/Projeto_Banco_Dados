import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const msg = (error as any).message || '';
        if (msg.includes('UNIQUE') || (error as any).code === '23505') {
          throw new ConflictException('Email already exists');
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ where: { active: true } });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);
    try {
      Object.assign(customer, updateCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const msg = (error as any).message || '';
        if (msg.includes('UNIQUE') || (error as any).code === '23505') {
          throw new ConflictException('Email already exists');
        }
      }
      throw error;
    }
  }

  async softDelete(id: number): Promise<void> {
    const customer = await this.findOne(id);
    customer.active = false;
    await this.customerRepository.save(customer);
  }
}
