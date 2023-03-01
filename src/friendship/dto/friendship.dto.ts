import { IsEmail, IsInstance, IsNotEmpty, IsUUID} from "class-validator";
import { User } from "src/users/entity/users.entity";



export class CreateFriendshipDto{

    @IsNotEmpty()
    @IsUUID()
    senderId: string;
  
    @IsNotEmpty()
    @IsUUID()
    receiverId: string;
  

}