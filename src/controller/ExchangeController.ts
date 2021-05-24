import { NextFunction, Request, Response, Router } from 'express';
import { ExchangeService } from '../services/ExchangeService';

export class ExchangeController {

    private exchangeService: ExchangeService;
    public router: Router;

    constructor() {
        this.exchangeService = new ExchangeService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getExchanges);
        this.router.post('/', this.postExchanges);
        this.router.put('/', this.putExchanges);
    }

    /**
     * GET exchange by id 
    */
     public findOne = async (req: Request, res: Response, next: NextFunction) => {
        const exchangeId = req.params.id;
        if (typeof exchangeId === undefined || exchangeId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        }
        else{
            res.send(await this.exchangeService.findUser(parseInt(exchangeId, 10)))
            return;
        }
    }

    /**
     * GET exchanges
    */
    public getExchanges = async (req: Request, res: Response, next: NextFunction) => {
        res.send(await this.exchangeService.findAll());
        return;
    }

    /**
     * POST exchanges
    */
    public postExchanges = async (req: Request, res: Response, next: NextFunction) => {}

    /**
     * PUT exchanges
    */
    public putExchanges = async (req: Request, res: Response, next: NextFunction) => {}
}
