import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(contact: Partial<Contact>): Promise<Contact> {
    const newContact = this.contactsRepository.create(contact);
    return this.contactsRepository.save(newContact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact request with ID ${id} not found`);
    }
    return contact;
  }

  async markAsProcessed(id: number): Promise<Contact> {
    const contact = await this.findOne(id);
    contact.processed = true;
    return this.contactsRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contactsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact request with ID ${id} not found`);
    }
  }
} 