import { Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Initial class for one course
 * @class Course
 */
@Entity()
export class Course {    
    @PrimaryGeneratedColumn()
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
    }
}
