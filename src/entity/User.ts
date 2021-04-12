import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    id: String;

    @Column()
    firstName: String;

    @Column()
    lastName: String;

    @Column()
    email: String;

    @Column()
    semester: String;
    
    @Column()
    enableConsultation: Boolean;
    
    @Column()
    enableViewing: Boolean;

    public constructor(_id = '', _firstName = '', _lastName = '', _email = '', _semester = '', 
        _enableConsultation = true, _enableViewing = true) {
        this.id = _id;
        this.firstName = _firstName;
        this.lastName = _lastName;
        this.email = _email;
        this.semester = _semester;
        this.enableConsultation = _enableConsultation;
        this.enableViewing = _enableViewing;
    }
}
