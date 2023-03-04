import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { Conversation } from './entity/conversation.entity';


@Injectable()
export class ChatService {
    constructor(
    private readonly userService: UsersService,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>

    ){}
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

    //Get Conversations
    async getConversations(user:User): Promise<Conversation[]> {
        
        return this.conversationRepository.createQueryBuilder('conversation')
        .leftJoin('conversation.members', 'member')
        .where('member.id = :userId', {userId: user.id})
        .getMany();

    }

    //Delete Conversation

    async deleteConversation(user:User, payload: ConversationDto): Promise<any>{
        const conversation = await this.conversationRepository.findOne({
            where: { id: payload.id },
            relations: ['members'],
          });
          
        // If conversation doesn't exist, throw error
        if (!conversation) {
            throw new NotFoundException(`Conversation with id not found`);
        }

        // If user is not a member of the conversation, throw error
        if (!conversation.members.some(member => member.id === user.id)) {
            throw new UnauthorizedException(`User is not a member of conversation`);
        }
        
        // If conversation has multiple members, remove user from members list
        if (conversation.members.length > 1) {
            conversation.members = conversation.members.filter(member => member.id !== user.id);
            await this.conversationRepository.save(conversation);
            } 
        else { // Otherwise, delete conversation
              await this.conversationRepository.delete(conversation.id);
            }
  


    }


}
