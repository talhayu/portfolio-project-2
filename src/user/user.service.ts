  // user.service.ts

  import { Injectable } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UserEntity } from './entities/user.entity';
  import { UserRepository } from './repository/user.repository';

  export type User = any;

  @Injectable()
  export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findOne(username: string): Promise<UserEntity | undefined> {
      return this.userRepository.findUserDetails(username);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    }
  }
