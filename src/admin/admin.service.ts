// admin-note.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RevokedTokenRepository } from 'src/auth/tokenrevoke/revoked-token.repository';
import { NoteEntity } from 'src/note/entities/note.entity';
import { NoteRepository } from 'src/note/note.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class AdminNoteService {
  revokedTokenRepository: any;
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository,
    private readonly revokeTokenRepository: RevokedTokenRepository,
  ) {}

  // Add methods for admin-specific operations here

  async getAllNotes(): Promise<NoteEntity[]> {
    return this.noteRepository.findAll();
  }
  async getbyid(id: number): Promise<NoteEntity> {
    const options: FindOneOptions<NoteEntity> = {
      where: { id },
    };
    const note = await this.noteRepository.findOne(options);
    if (!note) {
      throw new NotFoundException('Note not found.');
    }
    return note;
  }

  async deleteNoteById(id: number): Promise<void> {
    await this.noteRepository.deleteNote(id);
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<UserEntity> {
    const options: FindOneOptions<UserEntity> = {
      where: { id },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    await this.userRepository.deleteUserById(id);
  }
  
}
