import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityBase } from 'src/base/base.entity';
import { UserEntity } from 'src/user/entities/user.entity';


@Entity()
export class NoteEntity extends EntityBase {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('text', { array: true, default: [] }) // Use an array to store multiple tags
  tags: string[];


}
