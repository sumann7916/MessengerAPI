import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'dgram';
import { throwError } from 'rxjs';
import { FriendshipService } from 'src/friendship/friendship.service';
import { SocketGateway } from 'src/socket/gateway/socket.gateway';
import { SocketService } from 'src/socket/socket.service';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { CreateFileAndMessageDto, CreateMessageDto } from './dto/message.dto';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';


@Injectable()
export class ChatService {

    constructor(
    private readonly userService: UsersService,
    private readonly friendshipService: FriendshipService,


    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>


    ){}

    // ---------------------Conversation Service ----------------------

    async createConversation(userId: string, payload:ConversationDto): Promise<any> {

            //Check if both of them are valid members
            const member1 = await this.userService.findById(userId);
            const member2 = await this.userService.findById(payload.id);

            if(!member1 || !member2) {
                throw new BadRequestException("Users non-existent");
            }

            //Check if users are friends
            if(!this.friendshipService.isFriendOf(member1.id, member2.id)) {
                throw new UnauthorizedException("Can only create conversation with friends")
            }

            //Check if conversation between them already exists;
            const existingConversation = await this.conversationRepository.createQueryBuilder('conversation')
            .leftJoin('conversation.members', 'member1')
            .leftJoin('conversation.members', 'member2')
            .where('member1.id = :member1Id AND member2.id = :member2Id', { member1Id: member1.id, member2Id: member2.id })
            .orWhere('member1.id = :member2Id AND member2.id = :member1Id', { member1Id: member1.id, member2Id: member2.id })
            .getOne();

            console.log(existingConversation);
            
            
            if(existingConversation){
                throw new BadRequestException("Conversation between members already exist");
            }

        const conversation = new Conversation();
        conversation.members = [member1, member2]
        return this.conversationRepository.save(conversation);
    }

    //Get Conversation members by conversation Id
    async getConversationMembersById(conversationId: string): Promise<User[]> {
        const conversation = await this.conversationRepository
          .createQueryBuilder('conversation')
          .leftJoinAndSelect('conversation.members', 'members')
          .where('conversation.id = :conversationId', { conversationId })
          .getOne();
      
        if (!conversation) {
          throw new NotFoundException(`Conversation with id ${conversationId} not found`);
        }
      
        return conversation.members;
      }

    //Get Conversations
    async getConversations(user:User): Promise<Conversation[]> {
        
        return this.conversationRepository.createQueryBuilder('conversation')
        .leftJoin('conversation.members', 'member')
        .where('member.id = :userId', {userId: user.id})
        .getMany();

    }

    

    //Delete Conversation

    async deleteConversation(user:User, payload: ConversationDto): Promise<any>{

        //Check if user exists
        const foundUser = this.userService.findById(user.id)

        if(!foundUser){
            throw new NotFoundException("No user");
        }

        //Check if conversation where user is a member exist
        const conversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.members', 'members')
        .where('conversation.id = :conversationId', { conversationId: payload.id })
        .andWhere('members.id = :userId', { userId: user.id })
        .getOne();        
         
        // If conversation has multiple members, remove user from members list
        if (conversation.members.length > 1) {
            conversation.members = conversation.members.filter(member => member.id !== user.id);
            await this.conversationRepository.save(conversation);
            } 
        else { // Otherwise, delete conversation
              await this.conversationRepository.delete(conversation.id);
            }
    }

        //Get all messages of conversation
        async getConversationMessages(user: User, conversationId: string, page:number, limit:number): Promise<any> {

            //Check if user is part of conversation
            const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.members', 'members')
            .where('conversation.id = :conversationId', { conversationId })
            .andWhere('members.id = :userId', { userId: user.id })
            .getOne();
        
            if(!conversation) {
                throw new NotFoundException('No Conversation of that Id')
            }

            //Calculate offset and retrieve message for current page
            const offset = (page - 1) * limit;
            const messages = await this.messageRepository.find({
              where: { conversation: { id: conversationId } },
              relations: ['sender'],
              order: { createdAt: 'ASC' },
              skip: offset,
              take: limit
          });
            // Calculate the total number of pages
          const messageCount = await this.messageRepository.count({
              where: { conversation: { id: conversationId } }
            });
          const lastPage = Math.ceil(messageCount / limit);
            return {
              messages,
              page,
              lastPage
            }
          // // Retrieve all messages of the conversation
            // const messages = await this.messageRepository.find({
            //     where: { conversation: { id: conversationId } },
            //     relations: ['sender'],
            //     order: { createdAt: 'ASC' },
            // });
            // return messages;

        }



    //---------------------------Messages Services -----------------------------


     async createMessage(userId: string, payload: CreateMessageDto): Promise <Message> {
        
        //Check if users are valid
        const sender = await this.userService.findById(userId)
        const receiver = await this.userService.findById(payload.receiverId)
        if(!sender || !receiver) {
          throw new NotFoundException('No Such Users');
        }
        // //Check if users are friend
        // const areFriends:boolean = await this.friendshipService.isFriendOf(sender.id, receiver.id)
        // if(!areFriends){
        //     throw new UnauthorizedException("Can only send message to friends")
        // }
        //Check if conversation between them already exists;
        let conversation = await this.conversationRepository.createQueryBuilder('conversation')
        .leftJoin('conversation.members', 'member1')
        .leftJoin('conversation.members', 'member2')
        .where('member1.id = :member1Id AND member2.id = :member2Id', { member1Id: sender.id, member2Id: receiver.id })
        .orWhere('member1.id = :member2Id AND member2.id = :member1Id', { member1Id: sender.id, member2Id: receiver.id })
        .getOne();

        

      if (!conversation) {
        conversation = await this.conversationRepository.save({
          members: [sender, receiver],
        });
      }
        ;
        
        
        //Create new message entity and save
        return this.messageRepository.save({
            sender,
            content: payload.content,
            conversation
        })
     }
        

}
