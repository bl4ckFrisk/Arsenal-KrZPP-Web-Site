import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Query, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  Response,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import * as fs from 'fs';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/docs',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      // Allow common document types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Неподдерживаемый тип файла'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: string,
    @Body('description') description: string,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не выбран');
    }

    if (!category) {
      throw new BadRequestException('Категория обязательна');
    }

    const allowedCategories = ['technical', 'quality', 'production', 'legal', 'other'];
    if (!allowedCategories.includes(category)) {
      throw new BadRequestException('Недопустимая категория');
    }

    return this.documentsService.uploadDocument(file, req.user.id, category, description);
  }

  @Get()
  async getAllDocuments(@Query('category') category?: string) {
    return this.documentsService.findAll(category);
  }

  @Get(':id')
  async getDocument(@Param('id') id: number) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  async downloadDocument(@Param('id') id: number, @Response() res: any) {
    const document = await this.documentsService.findOne(id);
    const filePath = await this.documentsService.getDocumentPath(id);
    
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Файл не найден');
    }

    res.set({
      'Content-Type': document.mimeType,
      'Content-Disposition': `attachment; filename="${document.originalName}"`,
    });

    return res.sendFile(filePath);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number, @Req() req: any) {
    await this.documentsService.deleteDocument(id, req.user.id);
    return { message: 'Документ удален' };
  }
} 