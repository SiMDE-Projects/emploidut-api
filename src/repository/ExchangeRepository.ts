import { EntityRepository, Repository } from "typeorm";
import { Exchange, exchangeStatus } from "../entity/Exchange";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";

@EntityRepository(Exchange)
export class ExchangeRepository extends Repository<Exchange> {

    public findOneWithRelations = (id: number) => {
        return this.createQueryBuilder('exchange')
            .where("exchange.id = :id", { id })            
            .innerJoinAndSelect('exchange.exchangedTimeslot', 'exchangedTimeslot')
            .innerJoinAndSelect('exchange.desiredTimeslot', 'desiredTimeslot')
            .innerJoinAndSelect('exchange.suggesterStudent', 'suggesterStudent')
            .innerJoinAndSelect('exchange.aimStudent', 'aimStudent')
            .getOne()
    }

    public findWithRelations = () => {
        return this.createQueryBuilder('exchange')
            .innerJoinAndSelect('exchange.exchangedTimeslot', 'exchangedTimeslot')
            .innerJoinAndSelect('exchange.desiredTimeslot', 'desiredTimeslot')
            .innerJoinAndSelect('exchange.suggesterStudent', 'suggesterStudent')
            .innerJoinAndSelect('exchange.aimStudent', 'aimStudent')
            .getMany()
    }

    findByStatus(status: exchangeStatus) {
        return this.createQueryBuilder("exchange")
            .where("exchange.status = :status", { status })
            .getMany();
    }
}
