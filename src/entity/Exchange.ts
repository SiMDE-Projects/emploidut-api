import { Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Initial class which handles all the course exchanges
 * @class Exchange
 */
@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
    }
}
