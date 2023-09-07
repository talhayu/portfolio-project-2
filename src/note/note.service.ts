// note.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';
import { NoteEntity } from './entities/note.entity';
import { FindOneOptions } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async findAll(): Promise<NoteEntity[]> {
    return this.noteRepository.findAll();
  }

  async findOne(id: number): Promise<NoteEntity> {
    const options: FindOneOptions<NoteEntity> = { where: { id } };
    const user = await this.noteRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async create(createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    const errors = await validate(createNoteDto);
    if (errors.length > 0) {
      throw new Error('Access token expire login again');
    }
    const newNote: Partial<NoteEntity> = {
      title: createNoteDto.title,
      content: createNoteDto.content,
    };
    return this.noteRepository.createNote(newNote);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    const findOneOptions: FindOneOptions<NoteEntity> = { where: { id } };
    const existingNote = await this.noteRepository.findOne(findOneOptions);
    if (!existingNote) {
      throw new NotFoundException('Invalid item');
    }
    const errors = await validate(updateNoteDto);
    if (errors.length > 0) {
      throw new Error('Invalid data provided.');
    }

    return this.noteRepository.updateNote(id, updateNoteDto);
  }

  async delete(id: number): Promise<void> {
    const findOneOptions: FindOneOptions<NoteEntity> = { where: { id } };
    const existingNote = await this.noteRepository.findOne(findOneOptions);
    if (!existingNote) {
      throw new NotFoundException('Item not found');
    }

    await this.noteRepository.deleteNote(id);
  }
}
