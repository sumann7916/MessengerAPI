import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;
    
    @IsNotEmpty()
    content: string;
    
}

export class CreateFileAndMessageDto{
    image: any;

    @IsNotEmpty()
    receiverId: string;

    @IsOptional()
    content: string;

}