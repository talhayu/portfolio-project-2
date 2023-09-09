// import {
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { TokenRevocationMiddleware } from 'src/auth/tokenrevoke/token-revocation.middleware';

import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// @Injectable()
// export class AdminAuthGuard extends AuthGuard('jwt') {
//   constructor(private readonly tokenRevocationMiddleware: TokenRevocationMiddleware) {
//     super();
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // Check token revocation before anything else
//     await this.tokenRevocationMiddleware.use(context.switchToHttp().getRequest(), null, null);

//     const isAuth = await super.canActivate(context);

//     if (!isAuth) {
//       throw new UnauthorizedException('Unauthorized');
//     }   

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     // Check if the user has the required role (e.g., "ADMIN")
//     if (user.roles !== 'ADMIN') {
//       throw new UnauthorizedException('Unauthorized');
//     }

//     return true;
//   }
// }
@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const isAuth = super.canActivate(context);
    if (!isAuth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    
    // Check if the user has the required role (e.g., "note_manager")
    if (user.roles !=='ADMIN') {
      throw new UnauthorizedException();
    }

    return true;
  }
}