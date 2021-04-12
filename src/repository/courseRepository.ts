import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";

@EntityRepository()
export class UserRepository extends Repository<Course> {}