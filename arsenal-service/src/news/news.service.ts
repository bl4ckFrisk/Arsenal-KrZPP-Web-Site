import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  create(createNewsDto: CreateNewsDto) {
    const news = this.newsRepository.create(createNewsDto);
    return this.newsRepository.save(news);
  }

  findAll() {
    return this.newsRepository.find();
  }

  findOne(id: number) {
    return this.newsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    await this.newsRepository.update(id, updateNewsDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const news = await this.findOne(id);
    if (!news) {
      throw new Error('News not found');
    }
    return this.newsRepository.remove(news);
  }
} 