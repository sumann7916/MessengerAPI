import { IsEmail, IsNotEmpty, Length, Matches, Validate } from "class-validator";
import { PasswordMatches } from "../validators/password-matches.validator";
import { IsEmailUnique } from '../validators/is-email-unique.validator';



export class CreateUserDto{

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;


    @IsNotEmpty()
    @IsEmail()
    @Validate(IsEmailUnique)
    email: string;

    @IsNotEmpty()
    @Length(8,24)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;\\<>,./?])(?!.*\s).{8,16}$/, {message:"Password must have 1 lower case, 1 upper case, and special character"})
    password: string;

    
    @IsNotEmpty()
    @Length(8,24)
    @Validate(PasswordMatches, ['password'])
    confirm: string;


}

