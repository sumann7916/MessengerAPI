import { User } from "src/users/entity/users.entity";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";


@Entity({name: 'conversation'})
export class Conversation extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => User, user => user.conversations)
    members: User[];

    @OneToMany(()=> Message, messages=> messages.conversation)
    messages: Message[]
    
    @CreateDateColumn()
    createdAt: Date;

}