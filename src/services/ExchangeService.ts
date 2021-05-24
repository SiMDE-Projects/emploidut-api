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

    public findUser = async (id: number) => {
        const exchange = await this.exchangeRepository.findOneWithRelations(id);
        return exchange;
    }

    public findAll = async () => {
        const exchanges = await this.exchangeRepository.findWithRelations();
        return exchanges;
    }
}
