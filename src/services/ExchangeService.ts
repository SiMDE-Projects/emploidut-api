import { getCustomRepository } from "typeorm";
import { Exchange, ExchangeStatus } from "../entity/Exchange";
import { User } from "../entity/User";
import { ExchangeRepository } from "../repository/ExchangeRepository";
import { TimeSlotRepository } from "../repository/TimeSlotRepository";
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
        this.timeSlotRepository = getCustomRepository(TimeSlotRepository);
    }

    /**
     * Find exchange by id
     * @param id 
     * @returns Exchange | undefined
     */
    public findById = async (id: number) => {
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
     * Exchange 
     * @param exchange
     * @returns boolean
     */
    private swapTimeslot = async (exchange: Exchange) => {
        let oldExchange = exchange;

        // Validate the exchange in DB
        let exchangedTimeslot = await this.timeSlotRepository.findById(exchange.exchangedTimeslot.id);
        let desiredTimeslot = await this.timeSlotRepository.findById(exchange.desiredTimeslot.id);

        if (exchangedTimeslot !== undefined && desiredTimeslot !== undefined) {
            // Remove the suggester student his old time slot and add the new one
            exchangedTimeslot.users = exchangedTimeslot.users.filter(
                (user: User) => user !== exchange.suggesterStudent
            );
            exchangedTimeslot.users.push(exchange.aimStudent);

            // Remove the aim student his old time slot and add the new one
            desiredTimeslot.users = desiredTimeslot.users.filter(
                (user: User) => user !== exchange.aimStudent
            );
            desiredTimeslot.users.push(exchange.suggesterStudent);

            exchangedTimeslot = await this.timeSlotRepository.save(exchangedTimeslot);
            desiredTimeslot = await this.timeSlotRepository.save(desiredTimeslot);

            if ((exchangedTimeslot !== undefined || exchangedTimeslot !== null) &&
                (desiredTimeslot !== undefined || desiredTimeslot !== null)) {
                // Success
                return true;
            } else {
                // Error while validating the exchange -> restore before changes
                const exchangeResult = await this.exchangeRepository.save(oldExchange);
                if (exchangeResult !== undefined) {
                    Logger.error("Unable to restore the old exchange => id: " + oldExchange);
                }
                return false;
            }
        } else {
            Logger.error("Unable to swap students exchange");
            return false;
        }
    }

    /**
     * Save the changes for one exchange 
     * @param exchange
     * @returns boolean
     */
    private saveExchangeChanges = async (exchange: Exchange) => {
        const exchangeResult = await this.exchangeRepository.save(exchange);
        if (exchangeResult !== undefined) {
            return CallBack.Status.SUCCESS;
        } else {
            Logger.error("Unable to save exchange updates");
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Validate an exchange
     * @param exchange exchange 
     * @param user User who requested cancel
     * @returns number
     */
    public validate = async (exchange: Exchange, user: User) => {
        try {
            if (user.id === exchange.aimStudent.id) {
                if (exchange.status === ExchangeStatus.SUGGESTER_STUDENT_ACCEPTED) {
                    exchange.status = ExchangeStatus.VALIDATED;
                    if (!await this.swapTimeslot(exchange)){
                        return CallBack.Status.DB_ERROR;
                    } else {
                        return await this.saveExchangeChanges(exchange);
                    }
                } else if (exchange.status === ExchangeStatus.PENDING) {
                    exchange.status = ExchangeStatus.AIM_STUDENT_VALIDATED;
                    return await this.saveExchangeChanges(exchange);
                } else {
                    return CallBack.Status.SUCCESS;
                }
            } else if (user.id === exchange.suggesterStudent.id) {
                if (exchange.status === ExchangeStatus.AIM_STUDENT_VALIDATED) {
                    exchange.status = ExchangeStatus.VALIDATED;
                    if (!await this.swapTimeslot(exchange)){
                        CallBack.Status.DB_ERROR;
                    } else {
                        return await this.saveExchangeChanges(exchange);
                    }
                } else if (exchange.status === ExchangeStatus.PENDING) {
                    exchange.status = ExchangeStatus.SUGGESTER_STUDENT_ACCEPTED;
                    return await this.saveExchangeChanges(exchange);
                } else {
                    return CallBack.Status.SUCCESS;
                }
            } else {
                Logger.error("User find is not the requester or the aim one");
                return CallBack.Status.FAILURE;
            }
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Cancel an exchange
     * @param exchange exchange 
     * @param user User who requested cancel
     * @returns number
     */
     public cancel = async (exchange: Exchange, user: User) => {
        try {
            if (exchange.status === ExchangeStatus.CANCELLED) {
                Logger.info("Cancel exchange called for cancelled exchange");
                return CallBack.Status.SUCCESS;
            }

            if (user.id === exchange.aimStudent.id) {
                switch(exchange.status) {
                    case ExchangeStatus.VALIDATED: 
                        exchange.status = ExchangeStatus.AIM_STUDENT_CANCELLED;
                        return await this.saveExchangeChanges(exchange);
                        // TODO: Notify suggester client
                    case ExchangeStatus.SUGGESTER_STUDENT_ACCEPTED:
                        exchange.status = ExchangeStatus.CANCELLED;
                        if (!await this.swapTimeslot(exchange)){
                            CallBack.Status.DB_ERROR;
                        } else {
                            return await this.saveExchangeChanges(exchange);
                            // TODO: Notify both students
                        }
                    default: return CallBack.Status.SUCCESS;
                }
            } else if (user.id === exchange.suggesterStudent.id) {
                switch(exchange.status) {
                    case ExchangeStatus.VALIDATED:
                        exchange.status = ExchangeStatus.SUGGESTER_STUDENT_ACCEPTED;
                        return await this.saveExchangeChanges(exchange);
                        // TODO: Notify aim client
                    case ExchangeStatus.AIM_STUDENT_CANCELLED:
                        exchange.status = ExchangeStatus.CANCELLED;
                        if (!await this.swapTimeslot(exchange)){
                            return CallBack.Status.DB_ERROR;
                        } else {
                            return await this.saveExchangeChanges(exchange);
                            // TODO: Notify both students
                        }
                    default: return CallBack.Status.SUCCESS;
                }
            } else {
                Logger.error("User find is not the requester or the aim one");
                CallBack.Status.LOGIC_ERROR;
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
