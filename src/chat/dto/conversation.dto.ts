import { IsNotEmpty, IsUUID } from "class-validator";

export class ConversationDto {
    
    @IsUUID()
    @IsNotEmpty()
    id: string;
}

