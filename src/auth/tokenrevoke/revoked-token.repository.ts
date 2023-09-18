  import { DataSource, Repository } from 'typeorm';
  import { RevokedTokenEntity } from './revoked-token.entity';
  import { Injectable } from '@nestjs/common';

  @Injectable()
  export class RevokedTokenRepository extends Repository<RevokedTokenEntity> {

    constructor(private dataSource: DataSource){
      super(RevokedTokenEntity, dataSource.createEntityManager())
  }


    async isTokenRevoked(token: string): Promise<boolean> {
      try {
        const revokedToken = await this.findOne({ where: { token } });
        if (!revokedToken) {
          return false; // Token not found in the revoked tokens table, so it's not revoked.
        }
    
        // Check if the token has expired
        const currentTime = new Date();
        return currentTime >= revokedToken.expiresAt;
      } catch (error) {
        console.error('Error in isTokenRevoked:', error);
        throw error; // Optionally, you can rethrow the error for further handling.
      }
    }
    
    async revokeToken(token: string, expiration: Date): Promise<void> {
      try {
        const revokedToken = new RevokedTokenEntity();
        revokedToken.token = token;
        revokedToken.expiresAt = expiration;
        await this.save(revokedToken);
      } catch (error) {
        console.error('Error in revokeToken:', error);
        throw error; // Optionally, you can rethrow the error for further handling.
      }
    }
  }
