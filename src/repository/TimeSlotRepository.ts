import {EntityRepository, Repository} from "typeorm";
import {TimeSlot, timeSlotType} from "../entity/TimeSlot";

@EntityRepository(TimeSlot)
export class TimeSlotRepository extends Repository<TimeSlot> {

    findById(id: string){
        return this.findOne(id);
    }

    findByType(type: timeSlotType){
        return this.findOne({"type" : type});
    }

    findByRoomNumber(roomNumber: String){
        return this.findOne({"roomNumber" : roomNumber});
    }

    findByStartAt(startAt: TimeSlot){
        return this.findOne({"startAt" : startAt});
    }

    findByEndAt(endAt: TimeSlot){
        return this.findOne({"endAt" : endAt});
    }

    findAll() {
        return this.find();
    }
}
