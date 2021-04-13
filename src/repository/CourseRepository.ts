import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";

@EntityRepository(Course)
class CourseRepository extends Repository<Course> {}
