import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class PhotosService {
  private readonly photosPath = join(process.cwd(), 'uploads', 'photos');

  async getPhotosList(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.photosPath);
      
      // Фильтруем только файлы изображений
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const imageFiles = files.filter(file => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      });

      return imageFiles;
    } catch (error) {
      console.error('Ошибка чтения папки с фотографиями:', error);
      return [];
    }
  }
} 