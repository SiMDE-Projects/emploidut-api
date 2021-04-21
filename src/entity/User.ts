import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn("char", { length: 36 })
    id: String = '';
    
    @Column("varchar", { length: 10, nullable: true, unique: true})
    login!: String;

    @Column({default: true})
    enableConsultation: Boolean = true;

    @Column({default: true})
    enableViewing: Boolean = true;
}
