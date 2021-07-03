import { getCustomRepository } from "typeorm";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
import axios from 'axios';
import Logger from "./Logger";
import { User } from "../entity/User";

/**
 * TimeTable service class
*/
export class TimeTableService {

    private timeSlotRepository: TimeSlotRepository;

    constructor() {
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
    }
    
    /**
     * Find the timeTable (emploidut) for one user
     * @param login Login of the user
     * @returns 
     */
    public findTimeTable = async (user: User) => {
        // Try get value from UTC
        const responseAxios = {
            status: 404,
            data: null,
        };
        // const responseAxios = await axios({
        //     method: 'GET',
        //     url: `${process.env.TIME_TABLE_BASE_ROUTE}`,
        //     headers: {
        //         'Accept': 'application/json',
        //         'Accept-Charset': 'utf-8',
        //     }
        // }).catch((err: any) => {
        //     return err.response;
        // }).then((response: any) => {
        //     return response;
        // });

        if (responseAxios.status !== 200 || responseAxios.data !== undefined || responseAxios.data === null) {
            // TODO: Add real function to find the timeTable (emploidut)
            return { "timeslots": [] };
        } else {
            return "I need to parse the result";
        }
    }
}
