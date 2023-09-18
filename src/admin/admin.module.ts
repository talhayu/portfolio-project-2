// admin-note.module.ts
import { Module } from '@nestjs/common';
import { AdminNoteController } from './admin.controller';
import { AdminNoteService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenRevocationMiddleware } from 'src/auth/tokenrevoke/token-revocation.middleware';
import { JwtAuthGuard } from 'src/auth/Jwt.guards';
import { AdminAuthGuard } from './admin.guard';
import { NoteRepository } from 'src/note/note.repository';
import { RevokedTokenRepository } from 'src/auth/tokenrevoke/revoked-token.repository';
import { RevokedTokenModule } from 'src/auth/tokenrevoke/revoked-token.module';
import { UserRepository } from 'src/user/repository/user.repository';
// Import your AdminAuthGuard

@Module({
  imports: [ RevokedTokenModule],
  controllers: [AdminNoteController],
  providers: [
    TokenRevocationMiddleware,
    AdminNoteService,
    JwtAuthGuard,
    AdminAuthGuard,
    NoteRepository,
    UserRepository,
    RevokedTokenRepository,
    
  ], // Include your AdminAuthGuard in providers
})
export class AdminNoteModule {}
