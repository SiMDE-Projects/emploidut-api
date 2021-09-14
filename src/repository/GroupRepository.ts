import {EntityRepository, Repository} from "typeorm";
import { Group } from "../entity/Group";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
    public findById = (id: string) => {
        return this.createQueryBuilder("group")
            .where("group.id = :id", { id})
            .getOne()
    }
}
