import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'dgram';
import { SocketGateway } from 'src/socket/gateway/socket.gateway';
import { SocketService } from 'src/socket/socket.service';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { CreateMessageDto } from './dto/message.dto';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';


@Injectable()
export class ChatService {

    constructor(
    private readonly userService: UsersService,
    private readonly socketGateway: SocketGateway,


    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>


    ){}

    // ---------------------Conversation Service ----------------------

    async createConversation(user: User, payload:ConversationDto): Promise<any> {

            //Check if both of them are valid members
            const member1 = await this.userService.findById(user.id);
            const member2 = await this.userService.findById(payload.id);

            if(!member1 || !member2) {
                throw new BadRequestException("Users non-existent");
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

        //Needs some checking

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



    //---------------------------Messages Services -----------------------------

    async sendMessage(user:User, payload: CreateMessageDto): Promise<Message> {
        

        
        //Check if user and conversationId is valid
        const sender = await this.userService.findById(user.id)
        const receiver = await this.userService.findById(payload.receiverId)

        if(!sender || !receiver){
            throw new NotFoundException("No such users")
        }
        
        let conversation;
        
        
        //Checks if conversation exist between them
        conversation = await this.conversationRepository.createQueryBuilder('conversation')
        .leftJoin('conversation.members', 'member1')
        .leftJoin('conversation.members', 'member2')
        .where('member1.id = :member1Id AND member2.id = :member2Id', { member1Id: sender.id, member2Id: receiver.id })
        .orWhere('member1.id = :member2Id AND member2.id = :member1Id', { member1Id: sender.id, member2Id: receiver.id })
        .getOne();

        if(!conversation) {
            //Create new conversation
            conversation = await this.conversationRepository.save({members:[sender, receiver]});
        }
       
        //Create new message entity and save it
        const message = this.messageRepository.create({
            sender,
            content: payload.content,
            conversation
        });
        await this.messageRepository.save(message);
    

    //Emit message event to receiver's socket
    const data = {
        senderId: sender.id,
        recipientId: receiver.id,
        conversationId: conversation.id,
        message: message.content
    }

    this.socketGateway.handleNewMessage(data);

    return message;

}

}
