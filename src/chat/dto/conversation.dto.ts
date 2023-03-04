import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateConversationDto {
    
    @IsUUID()
    @IsNotEmpty()
    id: string;
}