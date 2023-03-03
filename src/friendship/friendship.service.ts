import { BadRequestException, Body, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AcceptFriendshipDto, CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipRequest, FriendshipStatus } from './entity/frienship-request.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(FriendshipRequest)
        private readonly friendshipRepository: Repository<FriendshipRequest>,
        private readonly userService: UsersService
    ){}


    async sendRequest(user: User ,payload: CreateFriendshipDto): Promise<any>{
            
        const senderId = user.id;
        const {receiverId} = payload;

        if(senderId === receiverId){
          throw new BadRequestException("Sender and receiver cannot be same");
        }

        //Check if receiver exist or not with that ID
        const sender = await this.userService.findById(senderId);  
              
        const receiver = await this.userService.findById(receiverId); 
        


        if(!sender || !receiver) throw new BadRequestException("Sender or Receiver not valid") //throw error if it does

        //Check if friendship exists with that Id or a request has already been sent
        const existingFriendship = await this.friendshipRepository.findOne({
          where: [{ sender: { id: senderId }, receiver: { id: receiverId } }, { sender: { id: receiverId }, receiver: { id: senderId } }],
        });
          

        
        if (existingFriendship !== null) {
            throw new BadRequestException("Friendship request already exists");
        }
        

        

      const friendshipRequest = this.friendshipRepository.create({
        sender,
        receiver,
        status: FriendshipStatus.pending,
      });

      //Save new Friendship Request entity to the database
      const createdRequest = await this.friendshipRepository.save(friendshipRequest);
      const { password, ...senderWithoutPassword } = createdRequest.sender;
      const { password: _, ...receiverWithoutPassword } = createdRequest.receiver;

      return {
      ...createdRequest,
      sender: senderWithoutPassword,
      receiver: receiverWithoutPassword,
      };
      
    }

    //Accept Friendship
    async acceptRequest(user: User, payload:AcceptFriendshipDto): Promise<any>{
      const acceptingUser = await this.userService.findById(user.id);

      if(!acceptingUser) throw new BadRequestException("User does not exist");

      const friendship = await this.friendshipRepository.createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.sender', 'sender')
      .leftJoinAndSelect('friendship.receiver', 'receiver')
      .where('friendship.id = :id', { id: payload.id })
      .andWhere('receiver.id = :userId', { userId: acceptingUser.id })
      .andWhere('friendship.status = :status', {status:FriendshipStatus.pending})
      .getOne();


      if(!friendship) throw new NotFoundException('Friendship request not found.');

      friendship.status = FriendshipStatus.accepted;
      await this.friendshipRepository.save(friendship);
      return { message: 'Friendship request accepted successfully.' };
    }
    
}
