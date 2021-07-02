import { NextFunction, Request, Response, Router } from 'express';
import { check, ValidationError, validationResult } from 'express-validator';
import { exchangeStatus } from '../entity/Exchange';
import { ExchangeService } from '../services/ExchangeService';
import CallBack from '../services/FunctionStatusCode';
import Logger from '../services/Logger';

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
        this.router.post(
            '/',
            [
                check('suggesterStudent')
                    .exists().withMessage('Field "suggesterStudent" is missing')
                    .isNumeric().trim().escape(),
                check('aimStudent')
                    .exists().withMessage('Field "aimStudent" is missing')
                    .isNumeric().trim().escape(),
                check('exchangedTimeslot')
                    .exists().withMessage('Field "exchangedTimeslot" is missing')
                    .isNumeric().trim().escape(),
                check('desiredTimeslot')
                    .exists().withMessage('Field "desiredTimeslot" is missing')
                    .isNumeric().trim().escape(),
                check('status')
                    .exists().withMessage('Field "status" is missing').
                    custom((value: String) => {
                        return (Object.values(exchangeStatus) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.postExchanges);
        this.router.put(
            '/:id',
            [
                check('suggesterStudent').isNumeric().trim().escape(),
                check('aimStudent').isNumeric().trim().escape(),
                check('exchangedTimeslot').isNumeric().trim().escape(),
                check('desiredTimeslot').isNumeric().trim().escape(),
                check('status').custom((value: String) => {
                    return (Object.values(exchangeStatus) as String[]).includes(value);
                }).trim().escape(),
            ],
            this.putExchanges);
        this.router.delete('/:id', this.deleteExchanges);
    }

    /**
     * GET exchange by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
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
     * GET all exchanges
     * @param req Express Response
     * @param res Express Response
     * @param next 
     * @returns 
     */
    public getExchanges = async (req: Request, res: Response, next: NextFunction) => {
        res.send(await this.exchangeService.findAll());
        return;
    }

    /**
     * POST exchange
     * @param req Express Request 
     * @param res Express Response
     * @param next Express NextFunction
     */
     public postExchanges = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('POST Course');
        // Check if there are format errors
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {            
            return `${location}[${param}]: ${msg}`;
        };

        // Check if there are validation errors
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            res.status(404).send({ errors: result.array() }).end();
            return;
        }

        // Body validation is now complete
        const responseCode = await this.exchangeService.create(req.body)
        switch (responseCode) {
            case CallBack.Status.DB_ERROR: {
                res.status(404).send("An error occurred while creating the entity. Please try later and verify values sent").end();
                break;
            }
            case CallBack.Status.FAILURE: {
                res.status(404).send("Fail to insert entity, Please try later and verify values sent").end();
                break;
            }
            case CallBack.Status.SUCCESS: {
                res.end();
                break;
            }
            default: break;
        }
        return;
    }

    /**
     * PUT exchange
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putExchanges = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('PUT Exchange');
        // Check if there are format errors
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {            
            return `${location}[${param}]: ${msg}`;
        };

        // Check if there are validation errors
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            res.status(404).send({ errors: result.array() }).end();
            return;
        }

        // Check path id
        const exchangeId = req.params.id;
        if (exchangeId === undefined || exchangeId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            // Body validation and path validation are now complete
            const responseCode = await this.exchangeService.update(req.body, parseInt(exchangeId!, 10));
            switch (responseCode) {
                case CallBack.Status.DB_ERROR: {
                    res.status(404).send("An error occurred while creating the entity. Please try later and verify values sent").end();
                    break;
                }
                case CallBack.Status.LOGIC_ERROR: {
                    res.status(404).send("Entity not found").end();
                    break;
                }
                case CallBack.Status.FAILURE: {
                    res.status(404).send("Fail to update entity. Please try later and verify values sent").end();
                    break;
                }
                case CallBack.Status.SUCCESS: {
                    res.end();
                    break;
                }
                default: break;
            }
            return;
        }
    }

    /**
     * DELETE exchange 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
     public deleteExchanges = async (req: Request, res: Response, next: NextFunction) => {
        // Check path id
        const exchangeId = req.params.id;
        if (exchangeId === undefined || exchangeId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        } else {
            const response = await this.exchangeService.delete(parseInt(exchangeId!, 10));
            res.end();
            return;
        }
    }
}
