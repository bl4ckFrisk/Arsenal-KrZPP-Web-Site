import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MessagesService, SendMessageDto } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @Req() req: any) {
    return this.messagesService.sendMessage(req.user.id, sendMessageDto);
  }

  @Get('chats')
  async getChats(@Req() req: any) {
    return this.messagesService.getChats(req.user.id);
  }

  @Get('conversation/:userId')
  async getConversation(@Param('userId') otherUserId: number, @Req() req: any) {
    return this.messagesService.getConversation(req.user.id, otherUserId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    return { count: await this.messagesService.getUnreadCount(req.user.id) };
  }

  @Get('recent')
  async getRecentMessages(@Query('limit') limit: number = 10, @Req() req: any) {
    return this.messagesService.getRecentMessages(req.user.id, limit);
  }

  @Put('mark-read/:messageId')
  async markMessageAsRead(@Param('messageId') messageId: number, @Req() req: any) {
    await this.messagesService.markAsRead(messageId, req.user.id);
    return { message: 'Message marked as read' };
  }

  @Put('mark-conversation-read/:userId')
  async markConversationAsRead(@Param('userId') otherUserId: number, @Req() req: any) {
    await this.messagesService.markConversationAsRead(req.user.id, otherUserId);
    return { message: 'Conversation marked as read' };
  }
} 