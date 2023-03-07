import { User } from "src/users/entity/users.entity";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name: "friends"})
export class Friends extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=> User, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user1Id'})
  user1: User;

  @ManyToOne(()=> User, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user2Id'})
  user2: User;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  
}