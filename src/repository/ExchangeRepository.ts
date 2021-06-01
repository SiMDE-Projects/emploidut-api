import { EntityRepository, Repository } from "typeorm";
import { Exchange, exchangeStatus } from "../entity/Exchange";

@EntityRepository(Exchange)
export class ExchangeRepository extends Repository<Exchange> {

    public findOneWithRelations = (id: number) => {
        return this.createQueryBuilder('exchange')
            .where("exchange.id = :id", { id })
            .leftJoinAndSelect('exchange.exchangedTimeslot', 'exchangedTimeslot')
            .leftJoinAndSelect('exchange.desiredTimeslot', 'desiredTimeslot')
            .leftJoinAndSelect('exchange.suggesterStudent', 'suggesterStudent')
            .leftJoinAndSelect('exchange.aimStudent', 'aimStudent')
            .getOne()
    }

    public findWithRelations = () => {
        return this.createQueryBuilder('exchange')
            .leftJoinAndSelect('exchange.exchangedTimeslot', 'exchangedTimeslot')
            .leftJoinAndSelect('exchange.desiredTimeslot', 'desiredTimeslot')
            .leftJoinAndSelect('exchange.suggesterStudent', 'suggesterStudent')
            .leftJoinAndSelect('exchange.aimStudent', 'aimStudent')
            .getMany()
    }

    findByStatus(status: exchangeStatus) {
        return this.createQueryBuilder("exchange")
            .where("exchange.status = :status", { status })
            .getMany();
    }
}
