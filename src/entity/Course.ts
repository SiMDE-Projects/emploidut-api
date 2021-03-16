<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
=======
import { Entity, PrimaryGeneratedColumn } from "typeorm";

>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
/**
 * Initial class for one course
 * @class Course
 */
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
=======
@Entity()
>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
export class Course {
    
    @PrimaryGeneratedColumn()
    id: number = 0;

    /**
     * Constructor for Course
     */
    constructor () {
<<<<<<< f817cab3b92f391aae33e9e99c83e67dc0419292:src/model/Course.ts
        this.id = 1;
=======
>>>>>>> Update file in order to use typeORM:src/entity/Course.ts
    }
}
