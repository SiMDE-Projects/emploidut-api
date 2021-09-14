import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { TimeSlot } from "./TimeSlot";
import { User } from "./User";

export enum ExchangeStatus {
    'PENDING' = 'PENDING',
    'SUGGESTER_STUDENT_ACCEPTED' = 'SUGGESTER_STUDENT_ACCEPTED',
    'AIM_STUDENT_VALIDATED' = 'AIM_STUDENT_VALIDATED',
    'VALIDATED' = 'VALIDATED',
    'SUGGESTER_STUDENT_CANCELLED' = 'SUGGESTER_STUDENT_CANCELLED',
    'AIM_STUDENT_CANCELLED' = 'AIM_STUDENT_CANCELLED',
    'CANCELLED' = 'CANCELLED'
};

/**
 * Initial class which handles all the course's exchanges
 * @class Exchange
 */
@Entity()
@Unique(["exchangedTimeslot", "desiredTimeslot", "suggesterStudent", "aimStudent"])
export class Exchange {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: ["PENDING" , "SUGGESTER_STUDENT_ACCEPTED", "AIM_STUDENT_VALIDATED", "VALIDATED" , "SUGGESTER_STUDENT_CANCELLED",
            "AIM_STUDENT_CANCELLED", "CANCELLED"],
        default: "PENDING"
    })
    status: String = ExchangeStatus.PENDING;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id)
    exchangedTimeslot!: TimeSlot;

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id)
    desiredTimeslot!: TimeSlot;

    @ManyToOne(() => User, user => user.id)
    suggesterStudent!: User;

    @ManyToOne(() => User, user => user.id)
    aimStudent!: User;

    /**
     * Constructor for Exchange
     */
    constructor () {}
}
