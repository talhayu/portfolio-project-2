// NoteAuthGuard.ts

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class NoteAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const isAuth = super.canActivate(context);
    if (!isAuth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // console.log('Request Object:', request);
    // console.log('User Object:', user);
    // console.log('Incoming Request Headers:', request.headers);

    // Check if the user has the required role (e.g., "note_manager")
    if (!user.roles==true) {
      throw new UnauthorizedException('nhsdh.');
    }

    return true;
  }
}
