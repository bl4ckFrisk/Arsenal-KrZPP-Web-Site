import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Artist } from '../tracks/artist.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    nickname: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['artist']
    });
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['artist']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname
    };
  }

  async getFullProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['artist']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const artist = await this.artistRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!artist) {
      // Create artist profile if it doesn't exist
      const newArtist = this.artistRepository.create({
        name: user.nickname,
        user: user
      });
      await this.artistRepository.save(newArtist);
      user.artist = newArtist;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      artist: user.artist
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname
      }
    };
  }

  async register(email: string, password: string, username: string, nickname: string): Promise<User> {
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if user with this email already exists
      const existingUserByEmail = await this.userRepository.findOne({ where: { email } });
      if (existingUserByEmail) {
        throw new ConflictException('User with this email already exists');
      }

      // Check if user with this username already exists
      const existingUserByUsername = await this.userRepository.findOne({ where: { username } });
      if (existingUserByUsername) {
        throw new ConflictException('User with this username already exists');
      }

      const hashedPassword = await argon2.hash(password);
      
      // Create user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        username,
        nickname,
      });
      await queryRunner.manager.save(user);

      // Create artist profile
      const artist = this.artistRepository.create({
        name: nickname,
        user: user
      });
      await queryRunner.manager.save(artist);

      // Commit transaction
      await queryRunner.commitTransaction();
      
      return user;

    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('User with this email or username already exists');
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Could not create user. Please try again.');
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}