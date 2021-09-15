import {EntityRepository, Repository, SelectQueryBuilder} from "typeorm";
import {TimeSlot, TimeSlotCriteria, timeSlotType} from "../entity/TimeSlot";

@EntityRepository(TimeSlot)
export class TimeSlotRepository extends Repository<TimeSlot> {

    private addCriteria(criteria: TimeSlotCriteria, query: SelectQueryBuilder<TimeSlot>) {
        const type = criteria.type;
        if (type !== undefined && type !== null) {
            query = query.andWhere("timeslots.type = :type", { type });
        }

        const roomNumber = criteria.roomNumber;
        if (roomNumber !== undefined && roomNumber !== null) {
            query = query.andWhere("timeslots.roomNumber = :roomNumber", { roomNumber });
        }

        const startAt = criteria.startAt;
        if (startAt !== undefined && startAt !== null) {
            query = query.andWhere("timeslots.startAt = :startAt", { startAt });
        }

        const endAt = criteria.endAt;
        if (endAt !== undefined && endAt !== null) {
            query = query.andWhere("timeslots.endAt = :endAt", { endAt });
        }

        const day = criteria.day;
        if (day !== undefined && day !== null) {
            query = query.andWhere("timeslots.day = :day", { day });
        }

        const frequency = criteria.frequency;
        if (frequency !== undefined && frequency !== null) {
            query = query.andWhere("timeslots.frequency = :frequency", { frequency });
        }

        return query;
    }

    public findById = (id: number) => {
        return this.createQueryBuilder("timeslots")
            .innerJoinAndSelect("timeslots.course", "course")
            .innerJoinAndSelect("timeslots.users", "user")
            .where("timeslots.id = :id", { id })
            .getOne()
    }

    public findByType = (type: timeSlotType) => {
        return this.findOne({"type" : type});
    }

    public findByRoomNumber = (roomNumber: String) => {
        return this.findOne({"roomNumber" : roomNumber});
    }

    public findByStartAt = (startAt: TimeSlot) => {
        return this.findOne({"startAt" : startAt});
    }

    public findByEndAt = (endAt: TimeSlot) => {
        return this.findOne({"endAt" : endAt});
    }

    public findAll = () => {
        return this.createQueryBuilder("timeslots")
            .innerJoinAndSelect("timeslots.course", "course")
            .getMany()
    }

    public findAllWithUsers = () => {
        return this.createQueryBuilder("timeslots")
            .innerJoinAndSelect("timeslots.course", "course")
            .innerJoinAndSelect("timeslots.users", "user")
            .getMany()
    }

    public findByCriteria = (criteria: TimeSlotCriteria) => {
        let query = this.addCriteria(criteria, this.createQueryBuilder("timeslots"));

        return query
            .innerJoinAndSelect("timeslots.course", "course")
            .getMany();
    }

    public findOneByCriteria = (criteria: TimeSlotCriteria) => {
        let query = this.addCriteria(criteria, this.createQueryBuilder("timeslots"));

        return query
            .innerJoinAndSelect("timeslots.course", "course")
            .getOne();
    }

    public findByCriteriaWithUsers = (criteria: TimeSlotCriteria) => {
        let query = this.addCriteria(criteria, this.createQueryBuilder("timeslots"));

        return query
            .innerJoinAndSelect("timeslots.users", "user")
            .innerJoinAndSelect("timeslots.course", "course")
            .getMany();
    }

    public findOneByCriteriaWithUsers = (criteria: TimeSlotCriteria) => {
        let query = this.addCriteria(criteria, this.createQueryBuilder("timeslots"));

        // console.log("query: ", query.innerJoinAndSelect("timeslots.users", "user").innerJoinAndSelect("timeslots.course", "course").getQueryAndParameters())
        return query
            .innerJoinAndSelect("timeslots.users", "user")
            .innerJoinAndSelect("timeslots.course", "course")
            .getOne();
    }

    public findTimeSlotByCourse = (courseId: String) => {
        return this.createQueryBuilder("timeslots")
            .innerJoinAndSelect("timeslots.users", "user")
            .innerJoinAndSelect("timeslots.course", "course", "course.id = :courseId", { courseId })
            // .where("course.id = :id", { courseId })
            .getMany();
    }
}
