import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    public constructor(id =0, age =0, firstName = '', lastName = '',) {
        this.id = id;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
