import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipRequest, FriendshipStatus } from './entity/frienship.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(FriendshipRequest)
        private readonly friendshipRepository: Repository<FriendshipRequest>,
        private readonly userService: UsersService
    ){}


    async sendRequest(payload: CreateFriendshipDto): Promise<FriendshipRequest>{
        const {senderId, receiverId} = payload;

        if(senderId === receiverId){
          throw new BadRequestException("Sender and receiver cannot be same");
        }

        //Check if users exist or not with that ID
        const sender = await this.userService.findById(senderId);
        const receiver = await this.userService.findById(receiverId);  

        if(!sender || !receiver) throw new BadRequestException("Sender or receiver not valid") //throw error if it does

        //Check if freindship already exists
        const existingFriendship = this.friendshipRepository.findOne({where:[{senderId, receiverId}, {senderId:receiverId, receiverId:senderId}]});
        if(existingFriendship){
          throw new BadRequestException("Request already exists");
        }

      const friendshipRequest = this.friendshipRepository.create({
        senderId,
        receiverId,
        status: FriendshipStatus.pending,
      });

      //Save new Friendship Request entity to the database
      return await this.friendshipRepository.save(friendshipRequest);
      
    }
}
