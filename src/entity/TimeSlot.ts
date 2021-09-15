import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
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
    roomNumber?: String;
    startAt?: String;
    endAt?: String;
    day?: String;
    frequency?: String;

    // Serialize from object to class
    constructor(object: Object) {
        if (object['course'] !== undefined || object['course'] !== null) {this.course = object['course'];}
        if (object['type'] !== undefined || object['type'] !== null) {this['type'] = object['type'];}
        if (object['roomNumber'] !== undefined || object['roomNumber'] !== null) {
            this['roomNumber'] = object['roomNumber'];
        }
        if (object['startAt'] !== undefined || object['startAt'] !== null) {this['startAt'] = object['startAt'];}
        if (object['endAt'] !== undefined || object['endAt'] !== null) {this['endAt'] = object['endAt'];}
        if (object['day'] !== undefined || object['day'] !== null) {this['day'] = object['day'];}
        if (object['frequency'] !== undefined || object['frequency'] !== null) {
            this['frequency'] = object['frequency'];
        }
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
