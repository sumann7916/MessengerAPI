import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, Get, Delete, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { ChatService } from './chat.service';
import { ConversationDto } from './dto/conversation.dto';
import { CreateFileAndMessageDto, CreateMessageDto } from './dto/message.dto';
import { Message } from './entity/message.entity';
import { diskStorage } from 'multer';
import { filename, imageFileFilter } from './helper/storage.helpers';


@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService
    ){}

    @Post('/create/conversation')
    @UsePipes(new ValidationPipe())
    async createConversation(@Request() req, @Body() payload: ConversationDto): Promise<any>{
        return this.chatService.createConversation(req.user, payload);
    }

    @Get('/conversations')
    @UsePipes(new ValidationPipe())
    async getConversations(@Request() req): Promise<any>{
        return await this.chatService.getConversations(req.user);
    }
    
    @Delete('/conversations')
    @UsePipes(new ValidationPipe())
    async deleteConversation(@Request() req, @Body() payload: ConversationDto): Promise <any>{
        return await this.chatService.deleteConversation(req.user, payload);
    }

    @Post('/send/message')
    @UsePipes(new ValidationPipe())
    async sendMessage(@Request() req, @Body() payload: CreateMessageDto): Promise <Message> {
        return await this.chatService.sendMessage(req.user, payload)
    }

    @Post('send/file')
    @UsePipes(new ValidationPipe())
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: 'static/chat',
            filename,
          }),
          fileFilter: imageFileFilter,
        }),)
        
    async sendFile(@Request() req, @Body() payload: CreateFileAndMessageDto, @UploadedFile() file: Express.Multer.File){
        if (!file) throw new BadRequestException({ message: 'Image is required.' });
        payload.image = '/' + file.path;
        return await this.chatService.sendFile(req.user, payload, file);
    }

    @Get('/getMessages/:conversationId')
    @UsePipes(new ValidationPipe())
    async getConversationMessages(@Request() req, @Param('conversationId') conversationId: string): Promise <Message[]> {
        return await this.chatService.getConversationMessages(req.user, conversationId);
        
    }}
