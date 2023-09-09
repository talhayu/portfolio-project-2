  import { Injectable } from '@nestjs/common';
  import { DataSource, In, Repository } from 'typeorm';
  import { NoteEntity } from './entities/note.entity';
  import { FindOneOptions } from 'typeorm';
  import { CreateNoteDto } from './dto/create-note.dto';
  import { UpdateNoteDto } from './dto/update-note.dto';

  @Injectable()
  export class NoteRepository extends Repository<NoteEntity> {
    constructor(private dataSource: DataSource) {
      super(NoteEntity, dataSource.createEntityManager());
    }

    async findAll(): Promise<NoteEntity[]> {
      return this.find();
    }

    async findNoteById(id: number): Promise<NoteEntity | undefined> {
      const findOneOptions: FindOneOptions<NoteEntity> = { where: { id },  };
      return this.findOne(findOneOptions);
    }
    async findNoteBytag(tag: string, userId: number): Promise<NoteEntity[]> {
      const notes = await this.createQueryBuilder('note')
        .where(':tag = ANY(note.tags)', { tag })
        .andWhere('note.user = :userId', { userId })
        .getMany();
    
      return notes;
    }
    

    async updateNote(id: number, NoteData: UpdateNoteDto): Promise<NoteEntity> {
      await this.update(id, NoteData);
      const findOneOptions: FindOneOptions<NoteEntity> = { where: { id } };
      return this.findOne(findOneOptions);
    }

    async createNote(NoteData: Partial<NoteEntity>): Promise<NoteEntity> {
      const newNote = this.create(NoteData);
      return this.save(newNote);
    }

   

    async deleteNote(id: number): Promise<void> {
      await this.delete(id);
    }

    
  }
