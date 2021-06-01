import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Course, courseType} from "./Course";

export type timeSlotType = 'Cours' | 'TD' | 'TP';
export type frequency = 'Weekly' | 'A' | 'B';

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

    @Column({
        type: "enum",
        enum: ["Cours" , "TD" , "TP"],
        default: "Cours"
    })
    type: timeSlotType = 'Cours';

    @Column("varchar", { length: 20})
    roomNumber!: String

    @Column("time")
    startAt!: TimeSlot

    @Column("time")
    endAt!: TimeSlot

    @Column({
        type: "enum",
        enum: ["Weekly" , "A" , "B"],
        default: "Weekly"
    })
    frequency: frequency = 'Weekly';

}
