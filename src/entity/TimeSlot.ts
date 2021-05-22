import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";

/**
 * Initial class for course's TimeSlot
 * @class TimeSlot
 */
@Entity()
export class TimeSlot {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @ManyToOne(() => Course, course => course.timeslots)
    course!: Course;
}
