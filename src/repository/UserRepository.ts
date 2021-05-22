import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

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
