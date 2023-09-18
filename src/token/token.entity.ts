// token.entity.ts
import { EntityBase } from 'src/base/base.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('token')
export class TokenEntity extends EntityBase{

  @Column()
  token: string;
    expiration: Date;


}
