import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallBack } from "passport-google-oauth20";
import { GOOGLE_AUTHENTICATION, GOOGLE_CALLBACK_URL } from "src/config";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            clientID: GOOGLE_AUTHENTICATION.clientId,
            clientSecret: GOOGLE_AUTHENTICATION.clientSecret,
            callbackURL: "http://localhost:3000/api/auth/google/callback",
            scope: ['email', 'profile']
        })
    }
    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifyCallBack):Promise <any>{
        done(null, profile);

    }
}