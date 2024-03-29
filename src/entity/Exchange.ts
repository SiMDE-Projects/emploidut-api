import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TimeSlot } from "./TimeSlot";
import { User } from "./User";

export enum exchangeStatus {
    'PENDING' = 'PENDING',
    'ACCEPTED' ='ACCEPTED',
    'VALIDATED' ='VALIDATED'
};

/**
 * Initial class which handles all the course's exchanges
 * @class Exchange
 */
@Entity()
@Unique(["exchangedTimeslot", "desiredTimeslot", "suggesterStudent", "aimStudent"])
export class Exchange {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: "enum",
        enum: ["PENDING" , "ACCEPTED" , "VALIDATED"],
        default: "PENDING"
    })
    status?: String = exchangeStatus.PENDING;

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id)
    exchangedTimeslot?: TimeSlot;

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id)
    desiredTimeslot?: TimeSlot;

    @ManyToOne(() => User, user => user.id)
    suggesterStudent?: User;

    @ManyToOne(() => User, user => user.id)
    aimStudent?: User;

    /**
     * Constructor for Exchange
     */
    constructor () {}
}
