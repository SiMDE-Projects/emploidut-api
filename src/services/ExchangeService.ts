import { getCustomRepository } from "typeorm";
import { Exchange, ExchangeStatus } from "../entity/Exchange";
import { ExchangeRepository } from "../repository/ExchangeRepository";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
import { UserRepository } from "../repository/UserRepository";
import CallBack from "./FunctionStatusCode";
import Logger from "./Logger";

/**
 * Exchange service class
*/
export class ExchangeService {

    private exchangeRepository: ExchangeRepository;
    private timeSlotRepository: TimeSlotRepository;

    constructor() {
        this.exchangeRepository = getCustomRepository(ExchangeRepository);
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository)
    }

    /**
     * Find exchange by id
     * @param id 
     * @returns Exchange | undefined
     */
    public findUser = async (id: number) => {
        const exchange = await this.exchangeRepository.findOneWithRelations(id);
        return exchange;
    }

    /**
     * Find all exchanges
     * @returns Exchange[] | undefined
     */
    public findAll = async () => {
        const exchanges = await this.exchangeRepository.findWithRelations();
        return exchanges;
    }

    /**
     * Validate an exchange
     * @param id 
     * @returns Exchange | undefined
     */
     public validate = async (exchange: Exchange) => {
        try {
            exchange.status = ExchangeStatus.VALIDATED;
            const exchangeResult = await this.exchangeRepository.save(exchange);
            if (exchangeResult !== undefined) {
                // Success, validate the exchange in DB
                let exchangedTimeslot = await this.timeSlotRepository.findOne(exchangeResult.exchangedTimeslot);
                let desiredTimeslot = await this.timeSlotRepository.findOne(exchangeResult.desiredTimeslot);

                if (exchangedTimeslot !== undefined && desiredTimeslot !== undefined) {
                    // Remove the suggester student his old time slot and add the new one
                    exchangedTimeslot.users = exchangedTimeslot.users.filter(
                        (user: number) => user !== exchangeResult.suggesterStudent.id
                    );
                    exchangedTimeslot.users.push(exchangeResult.aimStudent);

                    // Remove the aim student his old time slot and add the new one
                    desiredTimeslot.users = desiredTimeslot.users.filter(
                        (user: number) => user !== exchangeResult.aimStudent.id
                        );
                    desiredTimeslot.users.push(exchangeResult.suggesterStudent);

                    exchangedTimeslot = await this.timeSlotRepository.save(exchangedTimeslot);
                    desiredTimeslot = await this.timeSlotRepository.save(desiredTimeslot);

                    if ((exchangedTimeslot !== undefined || exchangedTimeslot !== null) &&
                        (desiredTimeslot !== undefined || desiredTimeslot !== null)) {
                        // Success
                        return CallBack.Status.SUCCESS;
                    } else {
                        // Error while validating the exchange
                        return CallBack.Status.FAILURE;
                    }

                } else {
                    // The exchange was not valid or one time slot has been deleted
                    return CallBack.Status.FAILURE;
                }
            }

            // Error while validating the exchange
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Create a new Exchange entity
     * @param body Validated body of the request
     * @returns Status code
     */
     public create = async (body: Object) => {
        try {
            const exchange = await this.exchangeRepository.save(body);
            if (exchange !== undefined || exchange !== null) {
                // Success
                return CallBack.Status.SUCCESS;
            }

            // Error while creating the new exchange (the exchange already exists)
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Update one Exchange
     * @param body Validated body of the request
     * @returns Status code
     */
     public update = async (body: Object, id: number) => {
        try {
            const exchange = await this.exchangeRepository.findOne(id);
            if (exchange !== undefined) {
                this.exchangeRepository.merge(exchange, body);
                const exchangeResult = await this.exchangeRepository.save(exchange);
                if (exchangeResult !== undefined || exchangeResult !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new exchange (the exchange already exists)
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
     * @param id Exchange's id to delete
     * @returns Status code
     */
     public delete = async (id: number) => {
        try {
            const results = await this.exchangeRepository.delete(id);
            return results.affected;
        }  catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }
}
