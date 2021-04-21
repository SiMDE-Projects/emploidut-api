import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";

/**
 * User service class
*/
export class UserService {
    static async getUsersByTimeSlots (timeSlots: TimeSlot) {
        // TODO: get the Token -> get user's information from the portail
        // const results = getRepository(TimeSlot).find({
        //     select: ["users"],
        // });
        return []; 
    }
}
