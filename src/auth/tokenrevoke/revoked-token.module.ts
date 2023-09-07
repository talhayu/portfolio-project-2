// revoked-token.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedTokenEntity } from './revoked-token.entity';
import { RevokedTokenRepository } from './revoked-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RevokedTokenEntity, RevokedTokenRepository])],
  providers: [RevokedTokenRepository],
  exports: [RevokedTokenRepository],
})
export class RevokedTokenModule {}
