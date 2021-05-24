import { getCustomRepository } from "typeorm";
import { Exchange } from "../entity/Exchange";
import { ExchangeRepository } from "../repository/ExchangeRepository";

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
}
