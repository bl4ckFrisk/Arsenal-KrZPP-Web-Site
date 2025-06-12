import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contact.entity';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() contact: Partial<Contact>): Promise<Contact> {
    return this.contactsService.create(contact);
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(+id);
  }

  @Put(':id/process')
  async markAsProcessed(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.markAsProcessed(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.contactsService.remove(+id);
  }
} 