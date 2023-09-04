import { EntityBase } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity('user')
export class UserEntity extends EntityBase{
    @Column({unique: true})
    username: string

    @Column()

    password: string 

    @Column({unique: true})
    email: string
    notes: any;

   
}
