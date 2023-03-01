import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipRequest } from './entity/frienship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendshipRequest])],
  providers: [FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
