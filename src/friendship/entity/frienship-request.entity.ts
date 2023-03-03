import { User } from "src/users/entity/users.entity";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'friendship_request'})
export class FriendshipRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column({ default: 'pending' })
  status: FriendshipStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn() 
  updatedAt: Date;
}

export enum FriendshipStatus {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  declined = 'DECLINED'

}