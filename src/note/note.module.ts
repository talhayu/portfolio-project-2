        // note.module.ts

        import { Module } from '@nestjs/common';
        import { NoteService } from './note.service';
        import { NoteController } from './note.controller';
        import { NoteEntity } from './entities/note.entity';
        import { TypeOrmModule } from '@nestjs/typeorm';
        import { NoteRepository } from './note.repository';
        import { RevokedTokenModule } from 'src/auth/tokenrevoke/revoked-token.module';

        @Module({
          imports: [TypeOrmModule.forFeature([NoteEntity]), RevokedTokenModule],
          controllers: [NoteController],
          providers: [NoteService, NoteRepository],
        })
        export class NoteModule {}
