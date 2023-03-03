import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from 'bcrypt';


@Entity({name:'users'})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @ManyToMany(() => User, user => user.sentFriendRequests)
  @JoinTable({
    name: 'sent_friend_requests',
    joinColumn: { name: 'sender_id' },
    inverseJoinColumn: { name: 'receiver_id' },
  })
  sentFriendRequests: User[];

  @ManyToMany(() => User, user => user.receivedFriendRequests)
  @JoinTable({
    name: 'received_friend_requests',
    joinColumn: { name: 'receiver_id' },
    inverseJoinColumn: { name: 'sender_id' },
  })
  receivedFriendRequests: User[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}