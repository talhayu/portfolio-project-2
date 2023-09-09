import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { secret } from 'src/constants/user.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    // Implement user validation logic here

    // Check if the token has expired
    const isTokenExpired = this.isTokenExpired(payload);
    if (isTokenExpired) {
      console.log('Token is expired');
      throw new UnauthorizedException('Token is expired, login again');
    }
    // Check if the user has the required role (e.g., "note_manager")
   // Check if the user has the required role (e.g., "USER")
   if (!payload.roles || (payload.roles !== 'USER' && payload.roles !== 'ADMIN')) {
    throw new UnauthorizedException('User does not have the required role');
  }
  


    // If the user has the required role and the token is not expired, return the user's information
    return { id: payload.id, username: payload.username, roles: payload.roles };
  }

  private isTokenExpired(payload: JwtPayload): boolean {
    return false; 
  }
}
