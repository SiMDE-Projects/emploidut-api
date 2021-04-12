import { Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Initial class for course's TimeSlot
 * @class TimeSlot
 */
@Entity()
export class TimeSlot {

    @PrimaryGeneratedColumn()
    id: number = 0;

    /**
     * Constructor for TimeSlot
     */
    constructor () {
    }
}
