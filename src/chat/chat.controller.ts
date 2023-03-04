import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/conversation.dto';


@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService
    ){}

    @Post('/create')
    @UsePipes(new ValidationPipe())
    async createConversation(@Request() req, @Body() payload: CreateConversationDto): Promise<any>{
        return this.chatService.createConversation(req.user, payload);
    }

    
    


}
