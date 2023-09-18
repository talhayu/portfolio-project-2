import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';


@Injectable()
export class TokenRepository extends Repository<TokenEntity> {
  constructor(private dataSource: DataSource) {
    super(TokenEntity, dataSource.createEntityManager());
  }
  async saveToken(token: string, expiration: Date): Promise<void> {
    const tokenEntity = new TokenEntity();
    tokenEntity.token = token;
    tokenEntity.expiration = expiration;
    await this.save(tokenEntity);
  }
 
}
