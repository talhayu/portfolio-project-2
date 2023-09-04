import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule} from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, UserModule],
  providers: [JwtService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
