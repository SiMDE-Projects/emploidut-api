import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

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

export enum dayType {
    'Monday' = 'Monday',
    'Tuesday' = 'Tuesday',
    'Wednesday' = 'Wednesday',
    'Thursday' = 'Thursday',
    'Friday' = 'Friday',
    'Saturday' = 'Saturday',
    'Sunday' = 'Sunday',
}

/**
 * Criteria which can be used in GET requests
 */
export class TimeSlotCriteria {
    course?: String;
    type?: String;
    roomNumber?: number;
    startAt?: String;
    endAt?: String;

    // Serialize from object to class
    constructor(queryPrams: any) {
        if (queryPrams.course !== undefined || queryPrams.course !== null) {this.course = queryPrams.course;}
        if (queryPrams.type !== undefined || queryPrams.type !== null) {this.type = queryPrams.type;}
        if (queryPrams.roomNumber !== undefined || queryPrams.roomNumber !== null) {
            this.roomNumber = queryPrams.roomNumber;
        }
        if (queryPrams.startAt !== undefined || queryPrams.startAt !== null) {this.startAt = queryPrams.startAt;}
        if (queryPrams.endAt !== undefined || queryPrams.endAt !== null) {this.endAt = queryPrams.endAt;}
    }
}

/**
 * Initial class for course's TimeSlot
 * @class TimeSlot
 */
@Entity()
@Unique(["roomNumber", "startAt", "endAt", "day"])
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
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        default: "Sunday"
    })
    day: String = dayType.Sunday;

    @Column({
        type: "enum",
        enum: ["Weekly" , "A" , "B", "Monthly"],
        default: "Weekly"
    })
    frequency: String = frequencyType.Weekly;

    @ManyToMany(() => User)
    @JoinTable({ name: 'timeslot_inscriptions' })
    users!: User[];
}
