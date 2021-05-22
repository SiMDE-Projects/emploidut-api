import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    findById(id: string){
        return this.createQueryBuilder("course")
            .where("course.id = :id", { id})
            .getOne()
    }

    findByName(name: string){
        return this.createQueryBuilder("course")
            .where("course.id = :id", { name})
            .getOne()
    }

    findByCourseType(courseType: string){
        return this.createQueryBuilder("course")
            .where("course.courseType = :id", { courseType})
            .getMany()
    }
}
