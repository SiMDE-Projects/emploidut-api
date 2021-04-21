import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn("char", { length: 36 })
    id: String;
    
    @Column("varchar", { length: 10, nullable: true})
    login!: String;

    @Column({default: true})
    enableConsultation: Boolean = true;

    @Column({default: true})
    enableViewing: Boolean = true;

    public constructor(_id = '') {
        this.id = _id;
    }
}
