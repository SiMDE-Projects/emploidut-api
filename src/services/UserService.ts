import {Connection, getRepository, getConnection, getCustomRepository} from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";

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
}
