import { Entity, PrimaryColumn , Column } from "typeorm";

export type courseType = 'CS' | 'TM' | 'TSH';

/**
 * Initial class for one course
 * @class Course
 */
@Entity()
export class Course {
  
    @PrimaryColumn()
    id: String;

    @Column()
    name: String;

    @Column()
    type: courseType;

    /**
     * Constructor for Course
     */
    constructor (_id = '', _name = '', _type: courseType) {
        this.id = _id;
        this.name = _name;
        this.type = _type;
    }
}
