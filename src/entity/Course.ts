import { Entity, PrimaryColumn, OneToMany, JoinTable } from "typeorm";
import { TimeSlot } from "./TimeSlot";

/**
 * Initial class for one course
 * @class Course
 */
@Entity()
export class Course {
  
    @PrimaryColumn()
    id: String = '';

    @OneToMany(() => TimeSlot, timeslots => timeslots.course)
    @JoinTable()
    timeslots!: TimeSlot[];
}
