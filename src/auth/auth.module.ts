import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'src/constants/user.constants';
import { PassportModule } from '@nestjs/passport';
import { TokenRevocationMiddleware } from './tokenrevoke/token-revocation.middleware';
import { RevokedTokenModule } from './tokenrevoke/revoked-token.module';
import { JwtStrategy } from './jwt.strategy';
import { TokenRepository } from 'src/token/token.repository';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: '2h' },
    }),
    RevokedTokenModule, // Include the RevokedTokenModule
  ],
  providers: [AuthService, TokenRevocationMiddleware, JwtStrategy, TokenRepository], // Include JwtStrategy in providers
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenRevocationMiddleware)
      .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
  }
}
