import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn("uuid")
    id!: String;

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

    image!: String;

    name!: String;

    isActive!: Boolean;

    public deserializeFromPortailData = (data: any) => {
        this.email = data.email;
        this.firstName = data.firstname;
        this.lastName = data.lastname;
        this.image = data.image;
        this.name = data.name;
        this.isActive = data.is_active;
    }
}
