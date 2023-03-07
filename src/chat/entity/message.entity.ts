import { User } from "src/users/entity/users.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Conversation } from "./conversation.entity";

@Entity()
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'text', nullable: true })
    image: string;
    
    @ManyToOne(()=> User)
    sender: User

    @ManyToOne(()=> Conversation)
    conversation: Conversation

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}