<<<<<<< HEAD:src/entity/Exchange.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Exchange.ts
=======
import { Entity, PrimaryGeneratedColumn } from "typeorm";

>>>>>>> Update file in order to use typeORM:src/entity/Exchange.ts
=======
import { Model } from 'sequelize';

>>>>>>> add_sql_orm:src/model/Exchange.ts
/**
 * Initial class which handles all the course exchanges
 * @class Exchange
 */
<<<<<<< HEAD:src/entity/Exchange.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Exchange.ts
 export class Exchange {
=======
 export class Exchange extends Model {
>>>>>>> add_sql_orm:src/model/Exchange.ts
    
=======
@Entity()
 export class Exchange {
    @PrimaryGeneratedColumn()
>>>>>>> Update file in order to use typeORM:src/entity/Exchange.ts
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
<<<<<<< HEAD:src/entity/Exchange.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Exchange.ts
        this.id = 1;
=======
>>>>>>> Update file in order to use typeORM:src/entity/Exchange.ts
=======
        super();
>>>>>>> add_sql_orm:src/model/Exchange.ts
    }

}
