import {Connection, getRepository, getConnection, getCustomRepository} from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";
import Logger from "./Logger";
import CallBack from "./FunctionStatusCode";

/**
 * User service class
*/
export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getCustomRepository(UserRepository);
    }

    /**
     * Find user by id
     * @param id 
     * @returns User | undefined
     */
    public findUser = async (id: number) => {
        const user = await this.userRepository.findOne(id);
        return user;
    }

    /**
     * Find all users
     * @param userCriteria 
     * @returns User[] | undefined
     */
    // public findUsers = async (userCriteria: UserCriteria) => {
    //     const users = await this.userRepository.findUsers(userCriteria);
    //     return users;
    // }

    /**
     * Get users by timeSlots
     * @param timeSlots 
     * @returns 
     */
    static async getUsersByTimeSlots (timeSlots: TimeSlot) {
        // TODO: get the Token -> get user's information from the portail
        // const results = getRepository(TimeSlot).find({
        //     select: ["users"],
        // });
        return [];
    }

    /**
     * Create a new user entity
     * @param body Validated body of the request
     * @returns Status code
     */
     public create = async (body: Object) => {
        try {
            const user = await this.userRepository.save(body);
            if (user !== undefined || user !== null) {
                // Success
                return CallBack.Status.SUCCESS;
            }

            // Error while creating the new user (the user already exists)
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Update one User
     * @param body Validated body of the request
     * @returns Status code
     */
     public update = async (body: Object, id: number) => {
        try {
            const user = await this.userRepository.findOne(id);
            if (user !== undefined) {
                this.userRepository.merge(user, body);
                const userResult = await this.userRepository.save(user);
                if (userResult !== undefined || userResult !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new user (the user already exists)
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
     * @param id User's id to delete
     * @returns Status code
     */
    public delete = async (id: number) => {
        try {
            const results = await this.userRepository.delete(id);
            return results.affected;
        }  catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }
}
