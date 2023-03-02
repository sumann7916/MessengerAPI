import { Body, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto} from './dto/user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    getUserByEmail(email: string) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    async doUserRegistration(@Body() payload: CreateUserDto): Promise<any> {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(payload.password, salt);
        payload.password = hashpassword;
        
        this.userRepository.save(payload);
        const {password,confirm, ...others} = payload
        return others;
    }
    
    async findById(id: any): Promise<User> {
        return await this.userRepository.findOneById(id)
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({where:{email: email}})
    }

}
