import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";
import { User } from "../entity/User";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    findById(id: String){
        return this.createQueryBuilder("course")
            .where("course.id = :id", { id})
            .getOne()
    }

    findByName(name: String){
        return this.createQueryBuilder("course")
            .where("course.id = :id", { name})
            .getOne()
    }

    findByCourseType(courseType: String){
        return this.createQueryBuilder("course")
            .where("course.courseType = :id", { courseType})
            .getMany()
    }
}
