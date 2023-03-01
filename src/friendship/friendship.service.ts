import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipRequest } from './entity/frienship.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(FriendshipRequest)
        private friendshipRepository: Repository<FriendshipRequest>
    ){}

    async sendRequest(payload: CreateFriendshipDto): Promise<FriendshipRequest>{
        const {senderId, receiverId} = payload;
    }
}
