import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";
import { User } from "../entity/User";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    public findById = (id: String) => {
        return this.createQueryBuilder("course")
            .where("course.id = :id", { id})
            .getOne()
    }

    public findByName = (name: String) => {
        return this.createQueryBuilder("course")
            .where("course.id = :id", { name})
            .getOne()
    }

    public findByCourseType = (courseType: String) => {
        return this.createQueryBuilder("course")
            .where("course.courseType = :id", { courseType})
            .getMany()
    }

    public findTimeTable = (user: User) => {
        return this.createQueryBuilder("course")
            .innerJoinAndSelect("course.timeslots", "ts")
            .innerJoinAndSelect("ts.users", "u")
            .where("u.id = :id", { id: user.id })
            .getMany()
    }
}
