import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { REDIS_CLIENT } from '../redis/redis.module';
import { AddItemDto } from './dto/add-item.dto';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
}

@Injectable()
export class CartService {
  private readonly TTL = 1800;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async createCart(): Promise<{ sessionId: string }> {
    const sessionId = randomUUID();
    const key = `cart:${sessionId}`;
    await this.redis.hset(key, 'items', JSON.stringify([]));
    await this.redis.expire(key, this.TTL);
    return { sessionId };
  }

  async addItem(
    sessionId: string,
    addItemDto: AddItemDto,
  ): Promise<Cart> {
    const key = `cart:${sessionId}`;
    const exists = await this.redis.exists(key);
    if (!exists) {
      throw new NotFoundException('Cart not found');
    }

    const itemsJson = await this.redis.hget(key, 'items');
    const items: CartItem[] = itemsJson ? JSON.parse(itemsJson) : [];

    const existingIndex = items.findIndex(
      (item) => item.productId === addItemDto.productId,
    );
    if (existingIndex >= 0) {
      items[existingIndex].quantity += addItemDto.quantity;
    } else {
      items.push({
        productId: addItemDto.productId,
        name: addItemDto.name,
        price: addItemDto.price,
        quantity: addItemDto.quantity,
      });
    }

    await this.redis.hset(key, 'items', JSON.stringify(items));
    await this.redis.expire(key, this.TTL);

    return { sessionId, items };
  }

  async getCart(sessionId: string): Promise<Cart> {
    const key = `cart:${sessionId}`;
    const exists = await this.redis.exists(key);
    if (!exists) {
      throw new NotFoundException('Cart not found');
    }

    const itemsJson = await this.redis.hget(key, 'items');
    const items: CartItem[] = itemsJson ? JSON.parse(itemsJson) : [];

    await this.redis.expire(key, this.TTL);

    return { sessionId, items };
  }

  async removeItem(
    sessionId: string,
    productId: string,
  ): Promise<Cart> {
    const key = `cart:${sessionId}`;
    const exists = await this.redis.exists(key);
    if (!exists) {
      throw new NotFoundException('Cart not found');
    }

    const itemsJson = await this.redis.hget(key, 'items');
    const items: CartItem[] = itemsJson ? JSON.parse(itemsJson) : [];

    const filteredItems = items.filter(
      (item) => item.productId !== productId,
    );
    if (items.length === filteredItems.length) {
      throw new NotFoundException(`Product #${productId} not in cart`);
    }

    await this.redis.hset(key, 'items', JSON.stringify(filteredItems));
    await this.redis.expire(key, this.TTL);

    return { sessionId, items: filteredItems };
  }

  async clearCart(sessionId: string): Promise<void> {
    const key = `cart:${sessionId}`;
    const exists = await this.redis.exists(key);
    if (!exists) {
      throw new NotFoundException('Cart not found');
    }
    await this.redis.del(key);
  }
}
