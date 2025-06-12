import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TracksModule } from './tracks/tracks.module';
import { User } from './users/user.entity';
import { Artist } from './tracks/artist.entity';
import { Track } from './tracks/track.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dev_user',
      password: '12345',
      database: 'postgres',
      entities: [User, Artist, Track],
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/api/uploads',
      serveStaticOptions: {
        index: false,
        fallthrough: true,
        maxAge: '1d',
        setHeaders: (res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Range');
          res.setHeader('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Range, Content-Length');
        }
      }
    }),
    AuthModule,
    TracksModule
  ],
})
export class AppModule {}