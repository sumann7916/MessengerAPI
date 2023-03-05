import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    
    @IsUUID()
    @IsNotEmpty()
    conversationId: string

    @IsNotEmpty()
    content: string
}