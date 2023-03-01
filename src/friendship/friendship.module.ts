import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipRequest } from './entity/frienship.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FriendshipRequest]), UsersModule],
  providers: [FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
