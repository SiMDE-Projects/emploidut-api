import { getCustomRepository } from "typeorm";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
import axios from 'axios';
import Logger from "./Logger";
import { User } from "../entity/User";
import CallBack from "./FunctionStatusCode";
import { CourseRepository } from "../repository/CourseRepository";
import { ParserService } from "./ParserService";
import { UserRepository } from "../repository/UserRepository";

/**
 * TimeTable service class
*/
export class TimeTableService {

    private parserService: ParserService;
    private timeSlotRepository: TimeSlotRepository;
    private userRepository: UserRepository;
    private courseRepository: CourseRepository;

    constructor() {
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
        this.courseRepository = getCustomRepository(CourseRepository);
        this.userRepository = getCustomRepository(UserRepository);
        this.parserService = new ParserService(this.timeSlotRepository, this.courseRepository);
    }

    private getUTCTimeTable = async (login: String) => {
        const responseAxios = await axios({
            method: 'GET',
            url: `${process.env.TIME_TABLE_BASE_ROUTE}?login=${login}`,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
            }
        }).catch((err: any) => {
            return err.response;
        }).then((response: any) => {
            return response;
        });

        if (responseAxios.status === 200) {
            return responseAxios.data;
        } else {
            Logger.error('Unable to reach webapplis route');
            return [];
        }
    }

    /**
     * Find the timeTable (emploidut) for one user
     * @param login Login of the user
     * @returns 
     */
    public findTimeTable = async (user: User) => {
        return await this.courseRepository.findTimeTable(user);
    }

    public create = async (requestUser: any) => {
        Logger.debug('Create function called');

        // First create the new user
        const user = await this.userRepository.save(requestUser);

        // Then get user utc's timeTable
        const result = await this.getUTCTimeTable(requestUser.login);

        await this.parserService.parseWebapplisResponse(result, user);
        return CallBack.Status.SUCCESS;
    }
}
