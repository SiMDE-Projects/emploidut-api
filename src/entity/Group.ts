import {Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id!: Number;

    @Column("varchar", { length: 10, nullable: false})
    title!: String;

    @ManyToOne(() => User, user => user.groups)
    owner!: User;

    @ManyToMany(() => User)
    @JoinTable({ name: 'users_in_groups' })
    users!: User[];
}
