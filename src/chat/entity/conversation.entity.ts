import { User } from "src/users/entity/users.entity";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'conversation'})
export class Conversation extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => User, user => user.conversations)
    members: User[];
  
    @CreateDateColumn()
    createdAt: Date;

}