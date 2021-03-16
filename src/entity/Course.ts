<<<<<<< HEAD:src/entity/Course.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
=======
import { Entity, PrimaryGeneratedColumn } from "typeorm";

>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
=======
import { Model } from 'sequelize';

>>>>>>> add_sql_orm:src/model/Course.ts
/**
 * Initial class for one course
 * @class Course
 */
<<<<<<< HEAD:src/entity/Course.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
=======
@Entity()
>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
export class Course {
=======
export class Course extends Model {
>>>>>>> add_sql_orm:src/model/Course.ts
    
    @PrimaryGeneratedColumn()
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
<<<<<<< HEAD:src/entity/Course.ts
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
        this.id = 1;
=======
>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
=======
        super();
>>>>>>> add_sql_orm:src/model/Course.ts
    }
}
