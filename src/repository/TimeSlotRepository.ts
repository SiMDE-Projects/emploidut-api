import {EntityRepository, Repository} from "typeorm";
import {TimeSlot, TimeSlotCriteria, timeSlotType} from "../entity/TimeSlot";

@EntityRepository(TimeSlot)
export class TimeSlotRepository extends Repository<TimeSlot> {

    public findById = (id: number) => {
        return this.createQueryBuilder("timeSlots")
            .innerJoinAndSelect("timeSlots.course", "course")
            .innerJoinAndSelect("timeSlots.users", "user")
            .where("timeSlots.id = :id", { id })
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
        return this.createQueryBuilder("timeSlots")
            .innerJoinAndSelect("timeSlots.course", "course")
            .getMany()
    }

    public findAllWithUsers = () => {
        return this.createQueryBuilder("timeSlots")
            .innerJoinAndSelect("timeSlots.course", "course")
            .innerJoinAndSelect("timeSlots.users", "user")
            .getMany()
    }

    public findByCriteria = (criteria: TimeSlotCriteria) => {
        let query = this.createQueryBuilder("timeSlots");

        const type = criteria.type;
        if (type !== undefined && type !== null) {
            query = query.andWhere("timeSlots.type = :type", { type });
        }

        const roomNumber = criteria.roomNumber;
        if (roomNumber !== undefined && roomNumber !== null) {
            query = query.andWhere("timeSlots.roomNumber = :roomNumber", { roomNumber });
        }

        const startAt = criteria.startAt;
        if (startAt !== undefined && startAt !== null) {
            query = query.andWhere("timeSlots.startAt = :startAt", { startAt });
        }

        const endAt = criteria.endAt;
        if (endAt !== undefined && endAt !== null) {
            query = query.andWhere("timeSlots.endAt = :endAt", { endAt });
        }

        return query
            .innerJoinAndSelect("timeSlots.course", "course")
            .getMany();
    }

    public findByCriteriaWithUsers = (criteria: TimeSlotCriteria) => {
        let query = this.createQueryBuilder("timeSlots");

        const type = criteria.type;
        if (type !== undefined && type !== null) {
            query = query.andWhere("timeSlots.type = :type", { type });
        }

        const roomNumber = criteria.roomNumber;
        if (roomNumber !== undefined && roomNumber !== null) {
            query = query.andWhere("timeSlots.roomNumber = :roomNumber", { roomNumber });
        }

        const startAt = criteria.startAt;
        if (startAt !== undefined && startAt !== null) {
            query = query.andWhere("timeSlots.startAt = :startAt", { startAt });
        }

        const endAt = criteria.endAt;
        if (endAt !== undefined && endAt !== null) {
            query = query.andWhere("timeSlots.endAt = :endAt", { endAt });
        }

        return query
            .innerJoinAndSelect("timeSlots.users", "user")
            .innerJoinAndSelect("timeSlots.course", "course")
            .getMany();
    }

    public findTimeSlotByCourse = (courseId: String) => {
        return this.createQueryBuilder("timeSlots")
            .innerJoinAndSelect("timeSlots.users", "user")
            .innerJoinAndSelect("timeSlots.course", "course", "course.id = :courseId", { courseId })
            // .where("course.id = :id", { courseId })
            .getMany();
    }
}
