import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeSlot } from "./TimeSlot";
import { User } from "./User";

export type exchangeStatus = 'PENDING' | 'ACCEPTED' | 'VALIDATED';

/**
 * Initial class which handles all the course's exchanges
 * @class Exchange
 */
@Entity()
export class Exchange {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: "enum",
        enum: ["PENDING" , "ACCEPTED" , "VALIDATED"],
        default: "PENDING"
    })
    status?: exchangeStatus = 'PENDING';

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
