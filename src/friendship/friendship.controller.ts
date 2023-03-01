import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
    constructor(private friendshipService: FriendshipService){}

    @Post('/sendRequest')
    @UsePipes(new ValidationPipe())
    async sendRequest(@Body() payload: CreateFriendshipDto){
        return await this.friendshipService.sendRequest(payload);
    }
}
