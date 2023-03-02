import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/@guards/local.guards';
import { CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
    constructor(private friendshipService: FriendshipService){}

    @UseGuards(LocalAuthGuard)
    @Post('/sendRequest')
    @UsePipes(new ValidationPipe())
    async sendRequest(@Body() payload: CreateFriendshipDto):Promise<any>{
        return await this.friendshipService.sendRequest(payload);
    }

    
}
