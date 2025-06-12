import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    middleName: string;
    position: string;
    department: string;
    employeeId: string;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  department: string;
  employeeId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { username }
    });
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ 
      where: { email }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      position: user.position,
      department: user.department,
      employeeId: user.employeeId
    };
  }

  async getFullProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      position: user.position,
      department: user.department,
      employeeId: user.employeeId
    };
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        position: user.position,
        department: user.department,
        employeeId: user.employeeId
      }
    };
  }

  async register(email: string, password: string, username: string): Promise<User> {
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
      
      // Create user with default values for new fields
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        username,
        firstName: '',
        lastName: '',
        middleName: '',
        position: '',
        department: '',
        employeeId: `EMP_${Date.now()}`
      });
      
      await this.userRepository.save(user);
      return user;

    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('User with this email or username already exists');
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Could not create user. Please try again.');
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Check if user with this email already exists
      const existingUserByEmail = await this.userRepository.findOne({ where: { email: userData.email } });
      if (existingUserByEmail) {
        throw new ConflictException('User with this email already exists');
      }

      // Check if user with this username already exists
      const existingUserByUsername = await this.userRepository.findOne({ where: { username: userData.username } });
      if (existingUserByUsername) {
        throw new ConflictException('User with this username already exists');
      }

      // Check if user with this employee ID already exists
      const existingUserByEmployeeId = await this.userRepository.findOne({ where: { employeeId: userData.employeeId } });
      if (existingUserByEmployeeId) {
        throw new ConflictException('User with this employee ID already exists');
      }

      const hashedPassword = await argon2.hash(userData.password);
      
      // Create user
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      
      await this.userRepository.save(user);
      return user;

    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('User with this email, username, or employee ID already exists');
      }
      console.error('User creation error:', error);
      throw new InternalServerErrorException('Could not create user. Please try again.');
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