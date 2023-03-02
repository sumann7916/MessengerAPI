import { Controller, Post, UseGuards, Request,Get,Response, Res } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/@guards/google.guards';
import { JwtGuard } from 'src/@guards/jwt.guards';
import { LocalAuthGuard } from 'src/@guards/local.guards';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
        ){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<any> {

        return this.authService.generateToken(req.user);
    }

    @UseGuards(JwtGuard)
    @Get('/user')
    async getUser(@Request() req):Promise<any>{
        return{
        id: req.user.id,
        email: req.user.email}
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleLogin(){}


    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async callback(@Request() req, @Res() res){

        const user =await this.userService.findByEmail(req.user.email)
        const jwt = await this.authService.generateToken(user);
        res.set('authorization', jwt.access_token);
        console.log(user);
        
        res.json(user)

    }

    //Testinng purpose
    @UseGuards(JwtGuard)
    @Get('test123')
    async test (@Res() res){
        return res.json("Google Auth Working")
    }
    
}


