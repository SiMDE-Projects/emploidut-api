import { getCustomRepository } from "typeorm";
import { Exchange } from "../entity/Exchange";
import { ExchangeRepository } from "../repository/ExchangeRepository";
import CallBack from "./FunctionStatusCode";
import Logger from "./Logger";

/**
 * Exchange service class
*/
export class ExchangeService {

    private exchangeRepository: ExchangeRepository;

    constructor() {
        this.exchangeRepository = getCustomRepository(ExchangeRepository);
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
