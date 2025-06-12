import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { Artist } from './artist.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Artist]),
    AuthModule
  ],
  controllers: [TracksController],
  providers: [TracksService]
})
export class TracksModule {}