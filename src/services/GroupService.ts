import { getCustomRepository } from "typeorm";
import { Group } from "../entity/Group";
import { User } from "../entity/User";
import { GroupRepository } from "../repository/GroupRepository";
import { UserRepository } from "../repository/UserRepository";
import CallBack from "./FunctionStatusCode";
import Logger from "./Logger";

/**
 * group service class
*/
export class GroupService {

    private groupRepository: GroupRepository;
    private userRepository: UserRepository;

    constructor() {
        this.groupRepository = getCustomRepository(GroupRepository);
        this.userRepository = getCustomRepository(UserRepository);
    }

    /**
     * Get group by id
     * @param id 
     * @returns group | undefined
     */
    public findOne = async (id: string) => {
        const group = await this.groupRepository.findById(id);
        return group;
    }

    /**
     * 
     * @returns group[] | undefined
     */
    public findAll = async () => {
        const groups = await this.groupRepository.find();
        return groups;
    }

    /**
     * Create a new group entity
     * @param body Validated body of the request
     * @returns Status code
     */
     public create = async (body: Object, user: User) => {
        try {
            const users = await this.userRepository.findUsers(body['users']);
            if (users.length > 0) {
                // Create the new group
                const group = new Group();
                group.title = body['title'];
                group.users = users;
                group.owner = user;

                // Save the group in DB
                const createdGroup = await this.groupRepository.save(group);
                if (createdGroup !== undefined || createdGroup !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new group (the group already exists)
                return CallBack.Status.FAILURE;
            }

            // Error while getting the users
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Update one group
     * @param body Validated body of the request
     * @returns Status code
     */
     public update = async (body: Object, id: number) => {
        try {
            const group = await this.groupRepository.findOne(id);
            if (group !== undefined) {
                this.groupRepository.merge(group, body);
                const groupResult = await this.groupRepository.save(group);
                if (groupResult !== undefined || groupResult !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new group (the group already exists)
                return CallBack.Status.FAILURE;
            }
            return CallBack.Status.LOGIC_ERROR;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * 
     * @param id group's id to delete
     * @returns Status code
     */
     public delete = async (id: number) => {
        try {
            const results = await this.groupRepository.delete(id);
            return results.affected;
        }  catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }
}
