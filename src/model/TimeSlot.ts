import { Model } from 'sequelize';

/**
 * Initial class for course's TimeSlot
 * @class TimeSlot
 */
 export class TimeSlot extends Model {

    id: number = 0;

    /**
     * Constructor for TimeSlot
     */
    constructor () {
        super();
    }

}
