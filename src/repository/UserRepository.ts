import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

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

    findByLogin(login: string){
        return this.findOne({"login" : login});
    }

    findAll() {
        return this.find();
    }

    findUsers(userList: Array<User> | Array<Number>) {
        let idsWhere: Array<any> = [];
        if (userList.length > 0 && Array.isArray(userList) && typeof userList[0] === "number") {
            for (let userId of userList as Array<Number>) {
                idsWhere.push({id: userId})
            }
            let query = {where: idsWhere}
            return this.find(query);
        }
        else {
            for (let user of userList as Array<User>) {
                idsWhere.push({id: user.id})
            }
            let query = {where: idsWhere}
            return this.find(query);
        }
    }
}
