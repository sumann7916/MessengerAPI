import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
    
        if (!user) throw new BadRequestException();
    
        const isMatch = await bcrypt.compare(pass, user.password);
    
        if (!isMatch) throw new UnauthorizedException();

        const {password, ...result} =user
    
        return result;
      }

      async generateToken(user:any):Promise <any> {
        return {
            access_token: this.jwtService.sign({
              email: user.email,
              sub: user.id,
            },
            {secret: JWT_SECRET}),
          };
      }
}


