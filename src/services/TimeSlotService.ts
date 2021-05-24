import {UserRepository} from "../repository/UserRepository";
import {getCustomRepository} from "typeorm";
import {TimeSlotRepository} from "../repository/TimeSlotRepository";

/**
 * TimeSlot service class
*/
export class TimeSlotService {
    
    private timeSlotRepository: TimeSlotRepository;
    constructor() {
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
    }

    public findTimeSlot = async (id: number) => {
        const timeSlot = await this.timeSlotRepository.findOne(id);
        return timeSlot;
    }
}
