<<<<<<< HEAD:src/entity/TimeSlot.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/TimeSlot.ts
=======
import { Entity, PrimaryGeneratedColumn } from "typeorm";

>>>>>>> Update file in order to use typeORM:src/entity/TimeSlot.ts
=======
import { Model } from 'sequelize';

>>>>>>> add_sql_orm:src/model/TimeSlot.ts
/**
 * Initial class for course's TimeSlot
 * @class TimeSlot
 */
<<<<<<< HEAD:src/entity/TimeSlot.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/TimeSlot.ts
 export class TimeSlot {
    
=======
@Entity()
 export class TimeSlot {
    @PrimaryGeneratedColumn()
>>>>>>> Update file in order to use typeORM:src/entity/TimeSlot.ts
=======
 export class TimeSlot extends Model {

>>>>>>> add_sql_orm:src/model/TimeSlot.ts
    id: number = 0;

    /**
     * Constructor for TimeSlot
     */
    constructor () {
<<<<<<< HEAD:src/entity/TimeSlot.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/TimeSlot.ts
        this.id = 1;
=======
>>>>>>> Update file in order to use typeORM:src/entity/TimeSlot.ts
=======
        super();
>>>>>>> add_sql_orm:src/model/TimeSlot.ts
    }

}
