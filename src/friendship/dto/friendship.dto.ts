import { IsEmail, IsInstance, IsNotEmpty, IsUUID} from "class-validator";
import { User } from "src/users/entity/users.entity";



export class CreateFriendshipDto{

    @IsNotEmpty()
    @IsUUID()
    senderId: User;
  
    @IsNotEmpty()
    @IsUUID()
    receiverId: User;
  

}