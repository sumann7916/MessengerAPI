import { BadRequestException, Body, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AcceptFriendshipDto, CreateFriendshipDto } from './dto/friendship.dto';
import { Friends } from './entity/friends.entity';
import { FriendshipRequest, FriendshipStatus } from './entity/frienship-request.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendshipRequest)
    private readonly friendshipRepository: Repository<FriendshipRequest>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    private readonly userService: UsersService,
  ) {}

  async sendRequest(user: User, payload: CreateFriendshipDto): Promise<any> {
    const senderId = user.id;
    const { receiverId } = payload;

    if (senderId === receiverId) {
      throw new BadRequestException('Sender and receiver cannot be same');
    }

    //Check if receiver exist or not with that ID
    const sender = await this.userService.findById(senderId);

    const receiver = await this.userService.findById(receiverId);

    if (!sender || !receiver)
      throw new BadRequestException('Sender or Receiver not valid'); //throw error if it does

    //Check if friendship exists with that Id or a request has already been sent
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
    });

    if (existingFriendship !== null) {
      throw new BadRequestException('Friendship request already exists');
    }

    const friendshipRequest = this.friendshipRepository.create({
      sender,
      receiver,
      status: FriendshipStatus.pending,
    });

    //Save new Friendship Request entity to the database
    const createdRequest = await this.friendshipRepository.save(
      friendshipRequest,
    );
    const { password, ...senderWithoutPassword } = createdRequest.sender;
    const { password: _, ...receiverWithoutPassword } = createdRequest.receiver;

    return {
      ...createdRequest,
      sender: senderWithoutPassword,
      receiver: receiverWithoutPassword,
    };
  }

  //Accept Friendship
  async acceptRequest(user: User, payload: AcceptFriendshipDto): Promise<any> {
    const user1 = await this.userService.findById(user.id);
    const user2 = await this.userService.findById(payload.user2Id);

    if (!user1 || !user2) throw new BadRequestException('User does not exist');

    // const friendship = await this.friendshipRepository.createQueryBuilder('friendship')
    // .leftJoinAndSelect('friendship.sender', 'sender')
    // .leftJoinAndSelect('friendship.receiver', 'receiver')
    // .where('friendship.id = :id', { id: payload.requestId })
    // .andWhere('receiver.id = :userId', { userId: user1.id })
    // .andWhere('friendship.status = :status', {status:FriendshipStatus.pending})
    // .getOne();

    const friendship = await this.friendshipRepository.findOne({
      where: {
        id: payload.requestId,
        receiver: { id: user1.id },
        status: FriendshipStatus.pending,
      },
      relations: ['sender', 'receiver'],
    });
    console.log(friendship);

    if (!friendship)
      throw new NotFoundException('Friendship request not found.');

    friendship.status = FriendshipStatus.accepted;

    await this.friendshipRepository.save(friendship);
    //Save to friendsEntity
    return this.friendsRepository.save({
      user1: user1,
      user2: user2,
    });
  }

  //Get friends of user
  async getFriends(id: String): Promise<User[]> {
    //Check user Id
    const user = await this.userService.findById(id);

    //Get Friends of user
    const friends = await this.friendsRepository
    .createQueryBuilder("friends")
    .leftJoinAndSelect("friends.user1", "user1")
    .leftJoinAndSelect("friends.user2", "user2")
    .where("user1.id = :userId OR user2.id = :userId", { userId: id })
    .getMany();

  // Combine the friend users into a single array
  const friendUsers = friends.reduce((users: User[], friend: Friends) => {
    if (friend.user1.id !== id) {
      users.push(friend.user1);
    }
    if (friend.user2.id !== id) {
      users.push(friend.user2);
    }
    return users;
  }, []);

  
  return friendUsers;    

  }

  //Check if users are friends
  async isFriendOf(user1Id: string, user2Id: string) {
    const friend = await this.friendsRepository.findOne({
      where: [{ user1: { id: user1Id }, user2: { id: user2Id } }, { user1: { id: user2Id }, user2: { id: user1Id } }]
    });

    console.log(friend);
    
    
    if (!friend) {
      // users are not friends
      
      return false;
    }
    
    // users are friends
    return true;
  }
}
