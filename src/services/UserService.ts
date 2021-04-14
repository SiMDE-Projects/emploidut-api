import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";

/**
 * User service class
*/
export class UserService {
    static async getUsersByTimeSlots (timeSlots: TimeSlot) {
        // const results = getRepository(TimeSlot).find({
        //     select: ["users"],
        // });
        return []; 
    }
}
