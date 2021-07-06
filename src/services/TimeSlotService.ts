import {getCustomRepository} from "typeorm";
import { TimeSlotCriteria } from "../entity/TimeSlot";
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
     * @returns TimeSlot | undefined | null
     */
    public findTimeSlot = async (id: number) => {
        try {
            const timeSlot = await this.timeSlotRepository.findById(id);
            return timeSlot;
        } catch (err) {
            Logger.error(err);
            return null;
        }
    }

    /**
     * Get users by timeSlot' id
     * @param id 
     * @returns TimeSlot | undefined | null
     */
     public findUsers = async (id: number) => {
        try {
            const timeSlot = await this.timeSlotRepository.findById(id);
            if (timeSlot !== undefined) {
                return timeSlot.users;
            } else {
                Logger.warn("TimeSlot not found");
                return [];
            }
        } catch (err) {
            Logger.error(err);
            return null;
        }
    }

    /**
     * Get TimeSlots by criteria
     * @param criteria TimeSlotCriteria
     */
     public findByCriteria = async (criteria: TimeSlotCriteria) => {
        try {
            const timeSlots = await this.timeSlotRepository.findByCriteria(criteria);
            return timeSlots;
        } catch (err) {
            Logger.error(err);
            return [];
        }
    }

    /**
     * Get all TimeSlots
     */
    public findAll = async () => {
        try {
            const timeSlots = await this.timeSlotRepository.findAll();
            return timeSlots;
        } catch (err) {
            Logger.error(err);
            return [];
        }
    }

    /**
     * Get TimeSlots by course's id
     */
     public findTimeSlotByCourse = async (courseId: String) => {
        try {
            const timeSlots = await this.timeSlotRepository.findTimeSlotByCourse(courseId);
            return timeSlots;
        } catch (err) {
            Logger.error(err);
            return [];
        }
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
