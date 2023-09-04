import { EntityBase } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class NoteEntity extends EntityBase {
@Column()
title: string

@Column()
content: string
}
