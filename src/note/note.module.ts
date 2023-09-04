import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteEntity } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteRepository } from './note.repository';

@Module({

  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository]
})
export class NoteModule {}
