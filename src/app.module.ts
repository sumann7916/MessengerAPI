import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormConfig } from './typeorm.config';
import { UsersModule } from './users/users.module';
import { FriendshipModule } from './friendship/friendship.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [    // TypeOrm database integration
  TypeOrmModule.forRootAsync({
    useFactory: () => TypeormConfig,
  }),
  UsersModule,
  FriendshipModule,
  AuthModule,
  SocketModule,
  ChatModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
