import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule
  ],
  providers: [SocketService, SocketGateway],
  exports: [SocketGateway]
})
export class SocketModule {}
