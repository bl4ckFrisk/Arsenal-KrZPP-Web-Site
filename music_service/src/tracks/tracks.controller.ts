import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    Body,
    Req,
    UnauthorizedException,
    Get,
    Param,
    Logger,
    BadRequestException,
    Delete
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { multerConfig } from '../configs/multer.config';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { diskStorage } from 'multer';

@Controller('tracks')
export class TracksController {
  private readonly logger = new Logger(TracksController.name);
  private readonly uploadPath = join(process.cwd(), 'uploads', 'tracks');
  private readonly coverPath = join(process.cwd(), 'uploads', 'covers');
  
  constructor(private readonly tracksService: TracksService) {
    // Ensure uploads directories exist
    [this.uploadPath, this.coverPath].forEach(path => {
      if (!existsSync(path)) {
        this.logger.log(`Creating directory at ${path}`);
        mkdirSync(path, { recursive: true });
      }
    });
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ], {
    storage: diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        const path = file.fieldname === 'cover' ? 'covers' : 'tracks';
        const uploadPath = join(process.cwd(), 'uploads', path);
        cb(null, uploadPath);
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${ext}`);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (file.fieldname === 'audio') {
        if (!file.originalname.match(/\.(mp3|wav|flac)$/)) {
          return cb(null, false);
        }
      } else if (file.fieldname === 'cover') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(null, false);
        }
      }
      cb(null, true);
    },
    limits: {
      fileSize: 100 * 1024 * 1024 // 100MB max for any file
    }
  }))
  async upload(
    @UploadedFiles() files: { audio?: Express.Multer.File[], cover?: Express.Multer.File[] },
    @Body() createTrackDto: CreateTrackDto,
    @Req() req,
  ) {
    this.logger.debug('Upload request received');
    this.logger.debug('User:', req.user);
    this.logger.debug('Files:', files);
    this.logger.debug('Body:', createTrackDto);
    
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!files.audio || !files.audio[0]) {
      throw new BadRequestException('No audio file uploaded');
    }

    const audioFile = files.audio[0];
    const coverFile = files.cover?.[0];

    // Validate file sizes
    if (coverFile && coverFile.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Cover file size must not exceed 5MB');
    }

    if (audioFile.size > 100 * 1024 * 1024) {
      throw new BadRequestException('Audio file size must not exceed 100MB');
    }

    // Validate file types
    if (!audioFile.originalname.match(/\.(mp3|wav|flac)$/)) {
      throw new BadRequestException('Only audio files (mp3, wav, flac) are allowed!');
    }

    if (coverFile && !coverFile.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException('Only image files (jpg, jpeg, png, webp) are allowed!');
    }

    this.logger.debug(`Audio file received: ${audioFile.originalname}, size: ${audioFile.size} bytes`);
    if (coverFile) {
      this.logger.debug(`Cover file received: ${coverFile.originalname}, size: ${coverFile.size} bytes`);
    }

    const result = await this.tracksService.create(
      createTrackDto,
      audioFile,
      coverFile,
      req.user.id
    );

    this.logger.debug('Track created:', result);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.tracksService.findAll();
  }

  @Get('artist/:id')
  @UseGuards(JwtAuthGuard)
  async findByArtist(@Param('id') artistId: number) {
    return this.tracksService.findByArtist(artistId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTrack(@Param('id') id: number, @Req() req) {
    this.logger.debug(`Delete request for track ${id} from user ${req.user.id}`);
    await this.tracksService.delete(id, req.user.id);
    return { message: 'Track deleted successfully' };
  }
}