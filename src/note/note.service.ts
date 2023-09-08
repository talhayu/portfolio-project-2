// note.service.ts

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';
import { NoteEntity } from './entities/note.entity';
import { FindOneOptions } from 'typeorm';
import { validate } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class NoteService {
 
  constructor(
    // @InjectRepository(NoteEntity)
    private readonly noteRepository: NoteRepository,
  ) {}

async findOne(id: number): Promise<NoteEntity> {
  const options: FindOneOptions<NoteEntity> = { 
    where: { id },
    relations: ['user'], // Specify the relation to load
  };
  const note = await this.noteRepository.findOne(options);
  if (!note) {
    throw new NotFoundException('Note not found.');
  }
  return note;
}

// note.service.ts
async doesNoteBelongToUser(noteId: number, userId: number): Promise<boolean> {
  const options: FindOneOptions<NoteEntity> = { 
    where: { id: noteId }, // Corrected 'id' here
    relations: ['user'], // Specify the relation to load
  };
  const note = await this.noteRepository.findOne(options);
  if (!note) {
    return false; // Note doesn't exist
  }
  return note.user.id === userId;
}




  async create(createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    const errors = await validate(createNoteDto);
    if (errors.length > 0) {
      throw new Error('Access token expire login again');
    }
    const newNote: Partial<NoteEntity> = {
      title: createNoteDto.title,
      content: createNoteDto.content,
      user: createNoteDto.userId,
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
      throw new Error('token is expire please login again');
    }

    return this.noteRepository.updateNote(id, updateNoteDto);
  }

// note.service.ts

async delete(id: number, userId: number): Promise<void> {
  // Check if the user owns the note before proceeding with deletion
  const isUserNote = await this.doesNoteBelongToUser(id, userId);
  if (!isUserNote) {
    throw new ForbiddenException("Access denied. This note does not belong to you.");
  }


  // Delete the note since the user owns it
  const result = await this.noteRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Note with ID ${id} not found.`);
  }
}


  async findNotesByUserId(userId: number): Promise<NoteEntity[]> {
    const notes = await this.noteRepository.find({
      where: { user: { id: userId } },
    });
    return notes;
  }


}
