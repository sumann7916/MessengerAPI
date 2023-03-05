import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, Get, Delete, Param } from '@nestjs/common';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { ChatService } from './chat.service';
import { ConversationDto } from './dto/conversation.dto';
import { CreateMessageDto } from './dto/message.dto';
import { Message } from './entity/message.entity';


@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService
    ){}

    @Post('/create-conversation')
    @UsePipes(new ValidationPipe())
    async createConversation(@Request() req, @Body() payload: ConversationDto): Promise<any>{
        return this.chatService.createConversation(req.user, payload);
    }

    @Get('/conversations')
    @UsePipes(new ValidationPipe())
    async getConversations(@Request() req): Promise<any>{
        return this.chatService.getConversations(req.user);
    }
    
    @Delete('/conversations')
    @UsePipes(new ValidationPipe())
    async deleteConversation(@Request() req, @Body() payload: ConversationDto): Promise <any>{
        return this.chatService.deleteConversation(req.user, payload);
    }

    @Post('/send-message')
    @UsePipes(new ValidationPipe())
    async sendMessage(@Request() req, @Body() payload: CreateMessageDto): Promise <Message> {
        return this.chatService.sendMessage(req.user, payload)
    }

    @Get('/getMessages/:conversationId')
    @UsePipes(new ValidationPipe())
    async getConversationMessages(@Request() req, @Param('conversationId') conversationId: string): Promise <Message[]> {
        return this.chatService.getConversationMessages(req.user, conversationId);
        
    }}
