import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipRequest } from './entity/frienship-request.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { Friends } from './entity/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendshipRequest, Friends]), UsersModule],
  providers: [FriendshipService],
  controllers: [FriendshipController],
  exports: [FriendshipService]
})
export class FriendshipModule {}
