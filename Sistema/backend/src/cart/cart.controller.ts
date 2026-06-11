import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartService, Cart } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart() {
    return this.cartService.createCart();
  }

  @Post(':sessionId/items')
  addItem(
    @Param('sessionId') sessionId: string,
    @Body() addItemDto: AddItemDto,
  ): Promise<Cart> {
    return this.cartService.addItem(sessionId, addItemDto);
  }

  @Get(':sessionId')
  getCart(@Param('sessionId') sessionId: string): Promise<Cart> {
    return this.cartService.getCart(sessionId);
  }

  @Delete(':sessionId/items/:productId')
  removeItem(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.removeItem(sessionId, productId);
  }

  @Delete(':sessionId')
  clearCart(@Param('sessionId') sessionId: string) {
    return this.cartService.clearCart(sessionId);
  }
}
