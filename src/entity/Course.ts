import { Entity, PrimaryColumn , Column, OneToMany, JoinTable } from "typeorm";
import { TimeSlot } from "./TimeSlot";

export type courseType = 'CS' | 'TM' | 'TSH';

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
    type: courseType = 'CS';

    @OneToMany(() => TimeSlot, timeslots => timeslots.course)
    @JoinTable()
    timeslots!: TimeSlot[];
}
