import { Exchange } from './../entity/Exchange';

export class ExchangeController {
    /**
     * GET exchanges for one student (login) 
     * Expect the login in queryParams
    */
    public static getExchanges = async (req?: any, res?: any, next?: any) => {
        const exchange = new Exchange();
        res.send(`user : ${req.query.login}, login : ${exchange.id}`);
    }

    /**
     * POST exchanges for one student (login) 
     * Expect the login in queryParams
    */
     public static postExchanges = async (req?: any, res?: any, next?: any) => {
        const exchange = new Exchange();
        res.send(`user : ${req.query.login}, login : ${exchange.id}`);
    }

    /**
     * PUT exchanges for one student (login) 
     * Expect the login in queryParams
    */
    public static putExchanges = async (req?: any, res?: any, next?: any) => {
        const exchange = new Exchange();
        res.send(`user : ${req.query.login}, login : ${exchange.id}`);
    }
}
