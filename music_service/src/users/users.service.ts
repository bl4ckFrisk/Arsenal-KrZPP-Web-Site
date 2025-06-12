import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  findAll(): Promise<User[]> {
    return this.userRepository.find(); // Fetch all users from the database
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } }); // Fetch a user by ID
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user); // Save a new user to the database
  }

  update(id: number, user: User): Promise<User> {
    return this.userRepository.save({ ...user, id }); // Update an existing user
  }

  remove(id: number): Promise<void> {
    return this.userRepository.delete(id).then(() => {}); // Delete a user by ID
  }

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Inject the User repository for database operations
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } }); // Fetch a user by email
  }
}
