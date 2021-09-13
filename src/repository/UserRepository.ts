import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";
import Logger from "../services/Logger";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    /*
    TODO: Add userCriteria in order to find all users with specific criteria

    findUsers(userCriteria: UserCriteria){
        let query = this.createQueryBuilder("user");
        let firstName = userCriteria.firstName;
        if (firstName != null){
            query = query.andWhere("user.firstName = :firstName", { firstName })
        }
        let lastName = userCriteria.lastName;
        if (lastName != null){
            query = query.andWhere("user.lastName = :lastName", { lastName })
        }
        let semester = userCriteria.semester;
        if (semester != null){
            query = query.andWhere("user.semester = :semester", { semester })
        }
        let enableViewing = userCriteria.enableViewing;
        if (enableViewing != null){
            query = query.andWhere("user.enableViewing = :enableViewing", { enableViewing })
        }
        let enableConsultation = userCriteria.enableConsultation;
        if (enableConsultation != null){
            query = query.andWhere("user.enableConsultation = :enableConsultation", { enableConsultation })
        }
        return query.getMany()
    } */

    findById(id: number){
        return this.findOne(id);
    }

    findByIdWithGroups(id: any) {
        return this.findOne(id, {
            relations: ['groups']
        });
    }

    findByLogin(login: String){
        return this.findOne({"login" : login});
    }

    findAll() {
        return this.find();
    }

    findUsers(userList: String[]) {
        if (userList.length > 0) {
            return this.createQueryBuilder("user")
                .where("user.id IN (:...ids)", { ids: [...userList] })
                .getMany();
        } else {
            return [];
        }

        // if (userList.length > 0 && Array.isArray(userList) && typeof userList[0] === "number") {
        //     Logger.debug(userList);
        //     query.where("user.id IN (:ids)").setParameter("ids", [1]);
        // }
        // else {
        //     query.where("user.id IN (:ids)").setParameter("ids", userList);
        // }

        // Logger.debug(query.getSql());
        // return query.getMany();
    }
}
