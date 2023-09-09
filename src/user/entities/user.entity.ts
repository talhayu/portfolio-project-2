import { NoteEntity } from 'src/note/entities/note.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  roles: string;

  @OneToMany(() => NoteEntity, (note) => note.user)
  notes: NoteEntity[];
}
