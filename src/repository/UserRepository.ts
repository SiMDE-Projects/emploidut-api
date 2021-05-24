import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";
import {UserCriteria} from "../entity/UserCriteria";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

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
    }
    findById(id: number){
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id})
            .getOne()
    }

    findByName(firstName: string, lastName: string) {
        return this.createQueryBuilder("user")
            .where("user.firstName = :firstName", { firstName })
            .andWhere("user.lastName = :lastName", { lastName })
            .getMany();
    }

    findByLogin(login: string){
        return this.createQueryBuilder("user")
            .where("user.login = :", {login})
            .getOne()
    }

    findByEmail(email: string){
        return this.createQueryBuilder("user")
            .where("user.email = :", {email})
            .getOne()
    }

    findBySemester(semester: string){
        return this.createQueryBuilder("user")
            .where("user.semester = :", {semester})
            .getOne()
    }

    findAll() {
        return this.createQueryBuilder("user")
            .getMany()
    }

    /*
    public async findAll(): Promise<User[]> {
        return await this.find({});
    }

    insertUser(user: User){

    }
    */
    public async findByIde(productId: number): Promise<User | null> {
        return await this.findOne() ?? null;
    }
}
