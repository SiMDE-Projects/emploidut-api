import { Model } from 'sequelize';

/**
 * Initial class which handles all the course exchanges
 * @class Exchange
 */
 export class Exchange extends Model {
    
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
        super();
    }

}
