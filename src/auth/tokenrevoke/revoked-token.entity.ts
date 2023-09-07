  import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

  @Entity('revoked_tokens')
  export class RevokedTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    expiresAt: Date;
  }
