import {EntityRepository, Repository} from "typeorm";
import { Course } from "../entity/Course";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public findById = (id: number) => {
        return this.findOne(id);
    }

    public findByIdWithGroups = (id: any) => {
        return this.findOne(id, {
            relations: ['groups']
        });
    }

    public findByLogin = (login: String) => {
        return this.findOne({"login" : login});
    }

    public findUsers = (userList: String[]) => {
        if (userList.length > 0) {
            return this.createQueryBuilder("user")
                .where("user.id IN (:...ids)", { ids: [...userList] })
                .getMany();
        } else {
            return [];
        }
    }

    public findUsersByCourse = (id: String) => {
        return this.createQueryBuilder().distinct()
            .innerJoin(Course, "course", "course.id = :id", { id })
            .innerJoin("course.timeslots", "timeslots")
            .getMany();
    }

    findUsersByCourse(id: String){
        return this.createQueryBuilder().distinct()
            .innerJoin(Course, "course", "course.id = :id", { id})
            .innerJoin("course.timeslots", "timeslots")
            .getMany();
    }

    findUsersByCourse(id: String){
        return this.createQueryBuilder().distinct()
            .innerJoin(Course, "course", "course.id = :id", { id})
            .innerJoin("course.timeslots", "timeslots")
            .getMany();
    }
}
