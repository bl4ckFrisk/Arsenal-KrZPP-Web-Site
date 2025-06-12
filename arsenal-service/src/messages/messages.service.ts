import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

export interface SendMessageDto {
  content: string;
  receiverId: number;
}

export interface ChatSummary {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessage(senderId: number, sendMessageDto: SendMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      content: sendMessageDto.content,
      senderId,
      receiverId: sendMessageDto.receiverId,
    });

    return this.messageRepository.save(message);
  }

  async getConversation(userId: number, otherUserId: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('(message.senderId = :userId AND message.receiverId = :otherUserId)')
      .orWhere('(message.senderId = :otherUserId AND message.receiverId = :userId)')
      .setParameters({ userId, otherUserId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async markAsRead(messageId: number, userId: number): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId !== userId) {
      throw new NotFoundException('Access denied');
    }

    message.isRead = true;
    message.readAt = new Date();
    await this.messageRepository.save(message);
  }

  async markConversationAsRead(userId: number, otherUserId: number): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true, readAt: new Date() })
      .where('senderId = :otherUserId AND receiverId = :userId AND isRead = false')
      .setParameters({ userId, otherUserId })
      .execute();
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
  }

  async getChats(userId: number): Promise<ChatSummary[]> {
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN m.senderId = $1 THEN m.receiverId 
          ELSE m.senderId 
        END as userId,
        u.username,
        u.firstName,
        u.lastName,
        last_msg.content as lastMessage,
        last_msg.createdAt as lastMessageAt,
        COALESCE(unread.count, 0) as unreadCount
      FROM messages m
      JOIN "user" u ON (
        CASE 
          WHEN m.senderId = $1 THEN u.id = m.receiverId 
          ELSE u.id = m.senderId 
        END
      )
      JOIN LATERAL (
        SELECT content, "createdAt"
        FROM messages 
        WHERE (senderId = $1 AND receiverId = u.id) OR (senderId = u.id AND receiverId = $1)
        ORDER BY "createdAt" DESC 
        LIMIT 1
      ) last_msg ON true
      LEFT JOIN (
        SELECT senderId, COUNT(*) as count
        FROM messages 
        WHERE receiverId = $1 AND "isRead" = false
        GROUP BY senderId
      ) unread ON unread.senderId = u.id
      WHERE m.senderId = $1 OR m.receiverId = $1
      ORDER BY last_msg."createdAt" DESC
    `;

    return this.messageRepository.query(query, [userId]);
  }

  async getRecentMessages(userId: number, limit: number = 10): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId')
      .setParameter('userId', userId)
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }
} 