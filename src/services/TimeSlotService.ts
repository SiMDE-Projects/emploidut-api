import {getCustomRepository} from "typeorm";
import {TimeSlotRepository} from "../repository/TimeSlotRepository";
import CallBack from "./FunctionStatusCode";
import Logger from "./Logger";

/**
 * TimeSlot service class
*/
export class TimeSlotService {
    
    private timeSlotRepository: TimeSlotRepository;

    constructor() {
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
    }

    /**
     * Get time slots by id
     * @param id 
     * @returns timeSlot | undefined
     */
    public findTimeSlot = async (id: number) => {
        const timeSlot = await this.timeSlotRepository.findOne(id);
        return timeSlot;
    }

    /**
     * Create a new TimeSlot entity
     * @param body Validated body of the request
     * @returns Status code
     */
     public create = async (body: Object) => {
        try {
            const timeSlot = await this.timeSlotRepository.save(body);
            if (timeSlot !== undefined || timeSlot !== null) {
                // Success
                return CallBack.Status.SUCCESS;
            }

            // Error while creating the new timeSlot (the timeSlot already exists)
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Update one TimeSlot
     * @param body Validated body of the request
     * @returns Status code
     */
     public update = async (body: Object, id: number) => {
        try {
            const timeSlot = await this.timeSlotRepository.findOne(id);
            if (timeSlot !== undefined) {
                this.timeSlotRepository.merge(timeSlot, body);
                const timeSlotResult = await this.timeSlotRepository.save(timeSlot);
                if (timeSlotResult !== undefined || timeSlotResult !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new timeSlot (the timeSlot already exists)
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
     * @param id TimeSlot's id to delete
     * @returns Status code
     */
    public delete = async (id: number) => {
        try {
            const results = await this.timeSlotRepository.delete(id);
            return results.affected;
        }  catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }
}
