import { Request, Response, Router } from 'express';
import { ExchangeService } from '../services/ExchangeService';
import { Exchange } from './../entity/Exchange';

export class ExchangeController {

    private exchangeService: ExchangeService;
    public router: Router;

    constructor() {
        this.exchangeService = new ExchangeService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/', this.getExchanges);
        this.router.post('/', this.postExchanges);
        this.router.put('/', this.putExchanges);
    }

    /**
     * GET exchanges for one student (login) 
     * Expect the login in queryParams
    */
    public getExchanges = async (req: Request, res: Response, next?: any) => {}

    /**
     * POST exchanges for one student (login) 
     * Expect the login in queryParams
    */
    public postExchanges = async (req: Request, res: Response, next?: any) => {}

    /**
     * PUT exchanges for one student (login) 
     * Expect the login in queryParams
    */
    public putExchanges = async (req: Request, res: Response, next?: any) => {}
}
