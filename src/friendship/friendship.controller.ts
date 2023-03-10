import { Body, Controller, Get, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { LocalAuthGuard } from 'src/@guards/local.guards';
import { User } from 'src/users/entity/users.entity';
import { AcceptFriendshipDto, CreateFriendshipDto } from './dto/friendship.dto';
import { FriendshipService } from './friendship.service';

@Controller('friendship_request')
@UseGuards(JwtGuard)
export class FriendshipController {
    constructor(private friendshipService: FriendshipService){}

    
    @Post('/sendRequest')
    @UsePipes(new ValidationPipe())
    async sendRequest(@Request() req, @Body() payload: CreateFriendshipDto):Promise<any>{

        return await this.friendshipService.sendRequest(req.user, payload);
    }

    @Post('/acceptRequest')
    @UsePipes(new ValidationPipe())
    async acceptRequest(@Request() req, @Body() payload: AcceptFriendshipDto): Promise<any>{
        return await this.friendshipService.acceptRequest(req.user, payload)
    }

    @Get('/getFriends')
    @UsePipes(new ValidationPipe())
    async getFriends(@Request() req):Promise <User []> {
        return await this.friendshipService.getFriends(req.user.id)
    }
}
