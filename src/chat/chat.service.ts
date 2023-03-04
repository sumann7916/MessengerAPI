import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/conversation.dto';
import { Conversation } from './entity/conversation.entity';


@Injectable()
export class ChatService {
    constructor(
    private readonly userService: UsersService,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>

    ){}
    async createConversation(user: User, payload:CreateConversationDto): Promise<any> {

            //Check if both of them are valid members
            const member1 = await this.userService.findById(user.id);
            const member2 = await this.userService.findById(payload.id);

            if(!member1 || !member2) {
                throw new BadRequestException("Users non-existent");
            }

            //Check if conversation between them already exists;
            const existingConversation = this.conversationRepository.createQueryBuilder('conversation')
            .leftJoin('conversation.members', 'member1')
            .leftJoin('conversation.members', 'member2')
            .where('member1.id = :member1Id AND member2.id = :member2Id', { member1Id: member1.id, member2Id: member2.id })
            .orWhere('member1.id = :member2Id AND member2.id = :member1Id', { member1Id: member1.id, member2Id: member2.id })
            .getOne();
            
            if(existingConversation){
                throw new BadRequestException("Conversation between members already exist");
            }

        const conversation = new Conversation();
        conversation.members = [member1, member2]
        return this.conversationRepository.save(conversation);

            
}
}
