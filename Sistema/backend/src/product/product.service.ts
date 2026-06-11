import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  attributes: Record<string, any>;
}

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private products: Map<string, ProductEntity> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const data: ProductEntity[] = [
      { id: randomUUID(), name: 'Notebook Ultra', description: 'Notebook 16GB RAM, 512GB SSD', price: 4999.90, category: 'Eletrônicos', attributes: { cor: 'prata' } },
      { id: randomUUID(), name: 'Mouse Wireless', description: 'Mouse óptico sem fio', price: 89.90, category: 'Eletrônicos', attributes: { cor: 'preto' } },
      { id: randomUUID(), name: 'Teclado Mecânico', description: 'Teclado RGB switch blue', price: 249.90, category: 'Eletrônicos', attributes: { cor: 'branco' } },
      { id: randomUUID(), name: 'Monitor 27"', description: 'Monitor IPS 4K 60Hz', price: 2199.90, category: 'Eletrônicos', attributes: { tamanho: '27"' } },
      { id: randomUUID(), name: 'Cadeira Gamer', description: 'Cadeira ergonômica reclinável', price: 1599.90, category: 'Móveis', attributes: { cor: 'preto' } },
      { id: randomUUID(), name: 'Fone Bluetooth', description: 'Fone over-ear com cancelamento de ruído', price: 349.90, category: 'Eletrônicos', attributes: { cor: 'azul' } },
    ];
    for (const p of data) {
      this.products.set(p.id, p);
    }
    this.logger.log(`Seeded ${data.length} products`);
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const product: ProductEntity = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      category: dto.category || '',
      attributes: dto.attributes || {},
    };
    this.products.set(product.id, product);
    return product;
  }

  async findAll(): Promise<ProductEntity[]> {
    return Array.from(this.products.values());
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = this.products.get(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.category !== undefined) product.category = dto.category;
    if (dto.attributes !== undefined) product.attributes = dto.attributes;
    this.products.set(id, product);
    return product;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    this.products.delete(id);
  }
}
