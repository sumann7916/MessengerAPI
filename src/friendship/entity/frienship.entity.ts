
import { User } from "src/users/entity/users.entity";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class FriendshipRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  senderId: string;

  @Column()
  receiverId: string;

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