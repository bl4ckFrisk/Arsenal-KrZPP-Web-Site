import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService, ProductSearchQuery, CreateProductDto, UpdateProductDto } from './products.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  async search(@Query() query: ProductSearchQuery) {
    return this.productsService.search(query);
  }

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold?: number) {
    return this.productsService.getLowStockProducts(threshold);
  }

  @Get('batch/:batchNumber')
  async findByBatch(@Param('batchNumber') batchNumber: string) {
    return this.productsService.findByBatch(batchNumber);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string) {
    return this.productsService.findByType(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
} 