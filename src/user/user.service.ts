import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type } from 'os';
import { UserRepository } from './repository/user.repository';
import { UserEntity } from './entities/user.entity';

export type User = any;

@Injectable()
export class UserService {
  users: any;
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findUserDetails(username);
  }

  async createUser(createUserDto: CreateUserDto ): Promise <UserEntity>{
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user)
  } 

}
