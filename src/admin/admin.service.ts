            // admin-note.service.ts
            import { Injectable } from '@nestjs/common';
            import { NoteEntity } from 'src/note/entities/note.entity';
            import { NoteRepository } from 'src/note/note.repository';
            import { CreateUserDto } from 'src/user/dto/create-user.dto';

            @Injectable()
            export class AdminNoteService {
            constructor(private readonly noteRepository: NoteRepository) {}

            // Add methods for admin-specific operations here
            async getAllNotes(): Promise<NoteEntity[]> {
                return this.noteRepository.findAll();
            }

            async deleteNoteById(id: number): Promise<void> {
                await this.noteRepository.deleteNote(id);
            }

            // Add methods for user management if needed
            //   async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
                
            //   }
            }
