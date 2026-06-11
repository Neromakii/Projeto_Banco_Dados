import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService, ProductEntity } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
