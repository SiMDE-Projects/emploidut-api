import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";

export enum timeSlotType {
    'Cours' = 'Cours',
    'TD' = 'TD',
    'TP' = 'TP'
}

export enum frequencyType {
    'Weekly' = 'Weekly',
    'A' = 'A',
    'B' = 'B',
    'Monthly' = 'Monthly'
}

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
    type: String = timeSlotType.Cours;

    @Column("varchar", { length: 20})
    roomNumber!: String

    @Column("time")
    startAt!: TimeSlot

    @Column("time")
    endAt!: TimeSlot

    @Column({
        type: "enum",
        enum: ["Weekly" , "A" , "B", "Monthly"],
        default: "Weekly"
    })
    frequency: String = frequencyType.Weekly;

}
