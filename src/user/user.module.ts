// user.module.ts

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { RevokedTokenRepository } from '../auth/tokenrevoke/revoked-token.repository';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
