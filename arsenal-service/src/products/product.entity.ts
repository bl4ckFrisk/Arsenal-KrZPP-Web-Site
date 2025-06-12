import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // наименование прибора

  @Column()
  type: string; // тип прибора

  @Column()
  batchNumber: string; // номер партии

  @Column()
  quantity: number; // количество

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  specifications: string; // технические характеристики

  @Column({ default: 'active' })
  status: string; // 'active', 'discontinued', 'development'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 