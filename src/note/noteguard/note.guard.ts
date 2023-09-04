import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
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

    if (!user || !user.roles.includes('note_manager')) {
      throw new UnauthorizedException('Not authorized to perform this action.');
    }

    return true; 
  }
}
