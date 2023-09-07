import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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
    const findOneOptions: FindOneOptions<NoteEntity> = { where: { id } };
    return this.findOne(findOneOptions);
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
