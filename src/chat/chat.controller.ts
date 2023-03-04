import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, Get, Delete, Param } from '@nestjs/common';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { ChatService } from './chat.service';
import { ConversationDto } from './dto/conversation.dto';


@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService
    ){}

    @Post('/create')
    @UsePipes(new ValidationPipe())
    async createConversation(@Request() req, @Body() payload: ConversationDto): Promise<any>{
        return this.chatService.createConversation(req.user, payload);
    }

    @Get('/')
    @UsePipes(new ValidationPipe())
    async getConversations(@Request() req): Promise<any>{
        return this.chatService.getConversations(req.user);
    }
    
    @Delete('/')
    @UsePipes(new ValidationPipe())
    async deleteConversation(@Request() req, @Body() payload: ConversationDto): Promise <any>{
        return this.chatService.deleteConversation(req.user, payload);

    }
}
