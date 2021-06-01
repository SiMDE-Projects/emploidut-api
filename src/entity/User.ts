import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: Number;

    @Column("varchar", { length: 10, nullable: false, unique: true})
    login!: String;

    @Column({default: true})
    enableConsultation: Boolean = true;

    @Column({default: true})
    enableViewing: Boolean = true;
    
    /**
     * These properties come from the portail
     */
    firstName!: String;

    lastName!: String;

    email!: String;

    semester!: String;
}
