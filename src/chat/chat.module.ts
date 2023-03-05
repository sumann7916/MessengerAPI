import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';
import { Socket } from 'dgram';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), UsersModule, SocketModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
