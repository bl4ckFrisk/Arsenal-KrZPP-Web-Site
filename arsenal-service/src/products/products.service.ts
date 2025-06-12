import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';

export interface ProductSearchQuery {
  name?: string;
  type?: string;
  batchNumber?: string;
  minQuantity?: number;
  maxQuantity?: number;
  status?: string;
}

export interface CreateProductDto {
  name: string;
  type: string;
  batchNumber: string;
  quantity: number;
  description?: string;
  specifications?: string;
  status?: string;
  price?: number;
}

export interface UpdateProductDto {
  name?: string;
  type?: string;
  batchNumber?: string;
  quantity?: number;
  description?: string;
  specifications?: string;
  status?: string;
  price?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: ProductSearchQuery): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (query.name) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:name)', { 
        name: `%${query.name}%` 
      });
    }

    if (query.type) {
      queryBuilder.andWhere('LOWER(product.type) LIKE LOWER(:type)', { 
        type: `%${query.type}%` 
      });
    }

    if (query.batchNumber) {
      queryBuilder.andWhere('LOWER(product.batchNumber) LIKE LOWER(:batchNumber)', { 
        batchNumber: `%${query.batchNumber}%` 
      });
    }

    if (query.minQuantity !== undefined) {
      queryBuilder.andWhere('product.quantity >= :minQuantity', { 
        minQuantity: query.minQuantity 
      });
    }

    if (query.maxQuantity !== undefined) {
      queryBuilder.andWhere('product.quantity <= :maxQuantity', { 
        maxQuantity: query.maxQuantity 
      });
    }

    if (query.status) {
      queryBuilder.andWhere('product.status = :status', { status: query.status });
    }

    return queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async findByBatch(batchNumber: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { batchNumber: Like(`%${batchNumber}%`) },
    });
  }

  async findByType(type: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { type: Like(`%${type}%`) },
    });
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.quantity <= :threshold', { threshold })
      .orderBy('product.quantity', 'ASC')
      .getMany();
  }
} 