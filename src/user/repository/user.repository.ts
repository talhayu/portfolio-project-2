import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findUserDetails(username: string): Promise<UserEntity | undefined> {
    return this.findOneBy({ username });
  }

  
  async createUser(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.save(user);
    } catch (error) {
        if (error.code === '23505' && error.detail.includes('already exists')) {
          throw new ConflictException(
            'Username already exists.',
            'CustomErrorCode',
          ); // Pass the custom error message and code
      }
      throw error;
    }
  }
    async findAll(): Promise<UserEntity[]> {
      return this.find();
    }

    async findUserById(id: number): Promise<UserEntity | undefined> {
      const findOneOptions: FindOneOptions<UserEntity> = { where: { id },  };
      return this.findOne(findOneOptions);
    }

    async deleteUserById(id: number): Promise<void>{
      await this.createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where("id = :id", { id })
      .execute();
    }
}
