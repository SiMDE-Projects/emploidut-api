import { getCustomRepository, getRepository } from "typeorm";
import { frequencyType, TimeSlotCriteria } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { CourseRepository } from "../repository/CourseRepository";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
import Logger from "./Logger";

const SME_FORMAT_STUDENT_REGEX = /([a-z0-9]{1,10})\s+([A-Z0-9]{3,5})\s+([0-9]{1,2})\s+(([A-Z0-9]{3,5}\s*)+)\$/;
const SME_FORMAT_UV_REGEX = /([A-Z0-9]{3,5})\s+([CDT])\s+([0-9]+)\s+/;
const SME_FORMAT_SLOT_REGEX = /\s*([ABC]*)\s*([A-Z]+)\.*\s*([0-9]{2}:[0-9]{2})-([0-9]{2}:[0-9]{2}),*\s*F([0-9]+),*\s*S=([A-Z0-9]*)\s*(>\(.*semaine ([ABC]) en distanciel\))*\$/;
const ROOM_NUMBER_REGEX = /([a-zA-Z]|\d)*/;
const FREQUENCY_REGEX = /[a-zA-Z\d\s\(\)]*semaine\s([A]|[B])/;
const DAY_TRANSLATION = {
    'lundi': 'Monday',
    'mardi': 'Tuesday',
    'mercredi': 'Wednesday',
    'jeudi': 'Thursday',
    'vendredi': 'Friday',
    'samedi': 'Saturday',
    'dimanche': 'Sunday',
}

/**
 * Parser Service class
 */
export class ParserService {

    private timeSlotRepository: TimeSlotRepository;
    private courseRepository: CourseRepository;

    constructor(
        _timeSlotRepository: TimeSlotRepository = getCustomRepository(TimeSlotRepository),
         _courseRepository: CourseRepository = getCustomRepository(CourseRepository)) {
        this.timeSlotRepository = _timeSlotRepository;
        this.courseRepository = _courseRepository;
    }

    private fromFrenchDayToEnglishDay = (day: String) => {
        return DAY_TRANSLATION[day.toLowerCase()];
    }

    private getFrequencyFromString = (str: string) => {
        const frequencyRegex = String(str).match(FREQUENCY_REGEX);
        let frequency = frequencyType.Weekly;
        if (frequencyRegex !== null) {
            frequency = frequencyType[frequencyRegex[1]];
            if (frequency === null || frequency === undefined) {
                frequency = frequencyType.Monthly;
            }
        }
        return frequency;
    }

    public parseSMEMail = async (mail: Object) => {
        for (const [key, value] of Object.entries(mail)) {
            // TODO: use regex to find values -> convert into entities -> store in DB
        }
    }

    public parseWebapplisResponse = async (object: Array<Object>, user: User) => {
        object.forEach(async (value) => {
            // Extract values from webbaplis result
            const courseName = String(value['uv']).toUpperCase();
            const roomNumber = String(value['room']).match(ROOM_NUMBER_REGEX);
            const day = this.fromFrenchDayToEnglishDay(value['day']);
            const frequency = this.getFrequencyFromString(String(value['group']));

            // Check if the course is already created however we create one
            let course = await this.courseRepository.findById(courseName);
            if (course === undefined) {
                Logger.debug("Creating a new course from the parser Service");
                course = await this.courseRepository.save({
                    "id": courseName,
                });
            }

            // Check if the timeslot is created however we create one
            const timeSlotCriteria = new TimeSlotCriteria({
                "course": courseName,
                "type": value['type'],
                "roomNumber": roomNumber !== null ? roomNumber[0] : '',
                "startAt": value['begin'],
                "endAt": value['end'],
                "day": day,
                "frequency": frequency
            });
            let timeSlot = await this.timeSlotRepository.findOneByCriteriaWithUsers(timeSlotCriteria);

            if (timeSlot !== undefined) {
                // TODO: Add only if he is not already present
                timeSlot.users.push(user);
                try {
                    await this.timeSlotRepository.save(timeSlot);
                } catch (err) {
                    Logger.error("Error saving timeSlot" + err);
                }
            } else {
                try{
                    Logger.debug("Creating a new time slot from the parser Service");
                    await this.timeSlotRepository.save({
                        "course": course,
                        "type": value['type'],
                        "roomNumber": roomNumber !== null ? roomNumber[0] : '',
                        "startAt": value['begin'],
                        "endAt": value['end'],
                        "day": day,
                        "frequency": frequency,
                        "users": [user]
                    });
                } catch (err) {
                    Logger.error("Error creating timeSlot" + err);
                }
            }
        });
    }
}
