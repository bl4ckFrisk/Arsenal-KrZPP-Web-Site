import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { Artist } from './artist.entity';
import { join } from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class TracksService {
  private readonly logger = new Logger(TracksService.name);

  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(
    createTrackDto: CreateTrackDto,
    audioFile: Express.Multer.File,
    coverFile: Express.Multer.File | undefined,
    userId: number,
  ): Promise<Track> {
    try {
      // Find the artist associated with the user
      const artist = await this.artistRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user']
      });

      if (!artist) {
        throw new NotFoundException(`Artist profile not found for user ${userId}`);
      }

      if (!audioFile) {
        throw new BadRequestException('Audio file is required');
      }

      // Get audio duration
      const duration = Math.round(await getAudioDurationInSeconds(audioFile.path));

      // Store relative paths in database (should be relative to uploads directory)
      const audioRelativePath = join('tracks', audioFile.filename).replace(/\\/g, '/');
      let coverRelativePath: string | undefined;

      if (coverFile) {
        // Ensure cover file is in the covers directory
        coverRelativePath = join('covers', coverFile.filename).replace(/\\/g, '/');
        this.logger.debug(`Cover file will be saved at: ${coverRelativePath}`);
      }
      
      // Create and save the track
      const track = new Track();
      track.title = createTrackDto.title;
      track.duration = duration;
      track.filePath = audioRelativePath;
      track.coverPath = coverRelativePath;
      track.artist = artist;

      const savedTrack = await this.tracksRepository.save(track);
      this.logger.debug('Track saved:', savedTrack);
      return savedTrack;

    } catch (error) {
      this.logger.error('Error creating track:', error);
      
      // Clean up files if save fails
      if (audioFile) {
        const audioPath = join(process.cwd(), 'uploads', 'tracks', audioFile.filename);
        if (existsSync(audioPath)) {
          await unlink(audioPath);
          this.logger.debug(`Cleaned up audio file at: ${audioPath}`);
        }
      }
      
      if (coverFile) {
        const coverPath = join(process.cwd(), 'uploads', 'covers', coverFile.filename);
        if (existsSync(coverPath)) {
          await unlink(coverPath);
          this.logger.debug(`Cleaned up cover file at: ${coverPath}`);
        }
      }

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create track: ' + error.message);
    }
  }

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find({ 
      order: {
        id: 'DESC'
      }
    });
  }

  async findByArtist(artistId: number): Promise<Track[]> {
    return this.tracksRepository.find({
      where: { artist: { id: artistId } },
      relations: ['artist', 'artist.user'],
      order: {
        id: 'DESC'
      }
    });
  }

  async delete(trackId: number, userId: number): Promise<void> {
    this.logger.debug(`Attempting to delete track ${trackId} for user ${userId}`);
    
    // Find the track with artist relation
    const track = await this.tracksRepository.findOne({
      where: { id: trackId },
      relations: ['artist', 'artist.user']
    });

    if (!track) {
      this.logger.warn(`Track with ID ${trackId} not found`);
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    this.logger.debug(`Found track: ${JSON.stringify(track)}`);

    // Check if the user owns this track
    if (track.artist.user.id !== userId) {
      this.logger.warn(`User ${userId} attempted to delete track ${trackId} owned by user ${track.artist.user.id}`);
      throw new UnauthorizedException('You can only delete your own tracks');
    }

    try {
      // Delete the audio file
      if (track.filePath) {
        const audioPath = join(process.cwd(), 'uploads', track.filePath);
        this.logger.debug(`Attempting to delete audio file at: ${audioPath}`);
        if (existsSync(audioPath)) {
          await unlink(audioPath);
          this.logger.debug('Audio file deleted successfully');
        } else {
          this.logger.warn(`Audio file not found at: ${audioPath}`);
        }
      }

      // Delete the cover file if it exists
      if (track.coverPath) {
        const coverPath = join(process.cwd(), 'uploads', track.coverPath);
        this.logger.debug(`Attempting to delete cover file at: ${coverPath}`);
        if (existsSync(coverPath)) {
          await unlink(coverPath);
          this.logger.debug('Cover file deleted successfully');
        } else {
          this.logger.warn(`Cover file not found at: ${coverPath}`);
        }
      }

      // Delete from database
      await this.tracksRepository.remove(track);
      this.logger.debug('Track deleted from database successfully');
    } catch (error) {
      this.logger.error('Error deleting track:', error);
      throw new BadRequestException('Failed to delete track: ' + error.message);
    }
  }

  getFilePath(track: Track): string {
    return join(process.cwd(), 'uploads', track.filePath);
  }
}