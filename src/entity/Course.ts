import { Entity, PrimaryColumn , Column, OneToMany, JoinTable } from "typeorm";
import { TimeSlot } from "./TimeSlot";

export enum courseType {
    'CS' = 'CS',
    'TM' = 'TM',
    'TSH' = 'TSH'
}

/**
 * Initial class for one course
 * @class Course
 */
@Entity()
export class Course {
  
    @PrimaryColumn()
    id: String = '';

    @Column("varchar")
    name: String = '';

    @Column({
        type: "enum",
        enum: ["CS" , "TM" , "TSH"],
        default: "CS"
    })
    type: String = courseType.CS;

    @OneToMany(() => TimeSlot, timeslots => timeslots.course)
    @JoinTable()
    timeslots!: TimeSlot[];
}
