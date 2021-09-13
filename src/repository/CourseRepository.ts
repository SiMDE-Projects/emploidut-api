import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";
import { User } from "../entity/User";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    findById(id: string) {
        return this.createQueryBuilder("course")
            .where("course.id = :id", { id})
            .getOne()
    }

    findByName(name: string) {
        return this.createQueryBuilder("course")
            .where("course.id = :id", { name})
            .getOne()
    }

    findByCourseType(courseType: string) {
        return this.createQueryBuilder("course")
            .where("course.courseType = :id", { courseType})
            .getMany()
    }

    findTimeTable(user: User) {
        return this.createQueryBuilder("course")
            .innerJoinAndSelect("course.timeslots", "ts")
            .innerJoinAndSelect("ts.users", "u")
            .where("u.id = :id", { id: user.id })
            .getMany()
    }
}
