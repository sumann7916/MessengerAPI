import { IsEmail, IsInstance, IsNotEmpty, IsUUID} from "class-validator";
import { User } from "src/users/entity/users.entity";



export class CreateFriendshipDto{
  
    @IsNotEmpty()
    @IsUUID()
    receiverId: string;

}

export class AcceptFriendshipDto {
    @IsNotEmpty()
    @IsUUID()
    requestId:string

    @IsNotEmpty()
    @IsUUID()
    user2Id:string

}