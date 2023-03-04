import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Conversation } from './entity/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
