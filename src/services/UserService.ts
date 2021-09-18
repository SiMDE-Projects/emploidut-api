import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/UserRepository";
import { User } from "../entity/User";
import Logger from "./Logger";
import CallBack from "./FunctionStatusCode";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
import { Token } from "../entity/Token";
var axios = require('axios');

/**
 * User service class
*/
export class UserService {

    private userRepository: UserRepository;
    private timeSlotRepository: TimeSlotRepository;

    constructor() {
        this.userRepository = getCustomRepository(UserRepository);
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
    }

    /** 
     * Find all users
     * @param id 
     * @returns User | undefined
     */
     public findAll = async () => {
        const users = await this.userRepository.find();
        return users;
    }

    /**
     * Find user by id
     * @param id 
     * @returns User | undefined
     */
    public findById = async (id: any) => {
        const user = await this.userRepository.findOne(id);
        return user;
    }

    /**
     * Find user by id adding his/her groups
     * @param id 
     * @returns User | undefined
     */
     public findByIdWithGroups = async (id: any) => {
        const user = await this.userRepository.findByIdWithGroups(id);
        return user;
    }

    /**
     * Find user by login
     * @param login
     * @returns User | undefined
     */
     public findByLogin = async (login: String) => {
        const user = await this.userRepository.findByLogin(login);
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
    public findUsersByTimeSlot = async (timeSlotId: number) => {
        // TODO: get the Token -> get user's information from the portail
        Logger.debug("findUsersByTimeSlot called");
        const timeSlot = await this.timeSlotRepository.findById(timeSlotId);
        if (timeSlot !== undefined) {
            return timeSlot.users;    
        } else {
            Logger.debug('TimeSlot ' + timeSlotId + ' not found');
            return [];
        }
        
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
