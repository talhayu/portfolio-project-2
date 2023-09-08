    import { EntityBase } from "src/base/base.entity";
    import { UserEntity } from "src/user/entities/user.entity";
    import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

    @Entity()
    export class NoteEntity extends EntityBase {
    @Column()
    title: string

    @Column()
    content: string

    @ManyToOne(() => UserEntity, user => user.notes)
    @JoinColumn({ name: 'user_id' }) 
    user: UserEntity;
    }
