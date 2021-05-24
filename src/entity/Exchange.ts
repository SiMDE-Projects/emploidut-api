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

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id, {
        eager: true
    })
    exchangedTimeslot?: TimeSlot;

    @ManyToOne(() => TimeSlot, timeSlot => timeSlot.id, {
        eager: true
    })
    desiredTimeslot?: TimeSlot;

    @ManyToOne(() => User, user => user.id, {
        eager: true
    })
    suggesterStudent?: User;

    @ManyToOne(() => User, user => user.id, {
        eager: true
    })
    aimStudent?: User;

    /**
     * Constructor for Exchange
     */
    constructor () {}
}
