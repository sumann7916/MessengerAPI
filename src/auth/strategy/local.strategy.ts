import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(
        private authService: AuthService
    ) {
        super({
            "usernameField":'email'
        })
    }
    async validate(email: string, pass: string ):Promise<any>{

        //validate user
        const user = await this.authService.validateUser(email, pass);
        
        if (!user) 
          throw new UnauthorizedException();
        
        
        return user;
    }

}