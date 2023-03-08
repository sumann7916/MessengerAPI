import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatModule } from 'src/chat/chat.module';
import { UsersModule } from 'src/users/users.module';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    ChatModule
  ],
  providers: [SocketService, SocketGateway],
  exports: [SocketService]
})
export class SocketModule {}
