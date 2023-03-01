import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private userService:UsersService){}


    @Post('/register')
    @UsePipes(new ValidationPipe())
    async doUserRegistration(@Body()payload: CreateUserDto){

        
        return await this.userService.doUserRegistration(payload);
    }
}
