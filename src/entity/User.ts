import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: Number;

    @Column("varchar", { length: 10, nullable: false, unique: true})
    login!: String;

    firstName!: String;

    lastName!: String;

    email!: String;

    semester!: String;

    @Column({default: true})
    enableConsultation: Boolean = true;

    @Column({default: true})
    enableViewing: Boolean = true;
}
