import { Model } from 'sequelize';

/**
 * Initial class for one course
 * @class Course
 */
export class Course extends Model {
    
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
        super();
    }

}
