import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {}
