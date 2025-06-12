import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async uploadDocument(file: Express.Multer.File, userId: number, category: string, description?: string): Promise<Document> {
    const document = this.documentRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      category,
      description,
      uploadedById: userId,
    });

    return this.documentRepository.save(document);
  }

  async findAll(category?: string): Promise<Document[]> {
    const queryBuilder = this.documentRepository.createQueryBuilder('document')
      .leftJoinAndSelect('document.uploadedBy', 'user')
      .orderBy('document.createdAt', 'DESC');

    if (category) {
      queryBuilder.where('document.category = :category', { category });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async deleteDocument(id: number, userId: number): Promise<void> {
    const document = await this.findOne(id);
    
    // Only the uploader can delete the document
    if (document.uploadedById !== userId) {
      throw new NotFoundException('Document not found or access denied');
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', 'docs', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.documentRepository.remove(document);
  }

  async getDocumentPath(id: number): Promise<string> {
    const document = await this.findOne(id);
    return path.join(process.cwd(), 'uploads', 'docs', document.filename);
  }
} 