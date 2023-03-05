import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    
    @IsUUID()
    @IsNotEmpty()
    receiverId: string

    @IsNotEmpty()
    content: string
    
}