import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    async doUserRegistration(@Body() payload: CreateUserDto) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(payload.password, salt);
        payload.password = hashpassword;
        
        this.userRepository.save(payload);
        const {password,confirm, ...others} = payload
        return others;
    }        
}
