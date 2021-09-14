import { NextFunction, Request, Response, Router } from 'express';
import { check, ValidationError, validationResult } from 'express-validator';
import { ExchangeStatus } from '../entity/Exchange';
import { ExchangeService } from '../services/ExchangeService';
import CallBack from '../services/FunctionStatusCode';
import Logger from '../services/Logger';
import { UserService } from '../services/UserService';

export class ExchangeController {

    private exchangeService: ExchangeService;
    private userService: UserService;
    public router: Router;

    constructor() {
        this.exchangeService = new ExchangeService();
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/', this.getExchanges);
        this.router.get('/:id', this.getOne);
        this.router.get('/:id/validate', this.validateExchange)
        this.router.get('/:id/cancel', this.cancelExchange)
        this.router.post(
            '/',
            [
                check('suggesterStudent')
                    .exists().withMessage('Field "suggesterStudent" is missing')
                    .isUUID().trim().escape(),
                check('aimStudent')
                    .exists().withMessage('Field "aimStudent" is missing')
                    .isUUID().custom((value, { req }) => value !== req.body.suggesterStudent).withMessage('Field "aimStudent" must be different from "suggesterStudent"')
                    .trim().escape(),
                check('exchangedTimeslot')
                    .exists().withMessage('Field "exchangedTimeslot" is missing')
                    .isNumeric().trim().escape(),
                check('desiredTimeslot')
                    .exists().withMessage('Field "desiredTimeslot" is missing')
                    .isNumeric().trim().escape(),
                check('status')
                    .exists().withMessage('Field "status" is missing').
                    custom((value: String) => {
                        return (Object.values(ExchangeStatus) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.postOne);
        this.router.put(
            '/:id',
            [
                check('suggesterStudent').isUUID().trim().escape(),
                check('aimStudent')
                    .isUUID().custom((value, { req }) => value !== req.body.suggesterStudent).withMessage('Field "aimStudent" must be different from "suggesterStudent"')
                    .trim().escape(),
                check('exchangedTimeslot').isNumeric().trim().escape(),
                check('desiredTimeslot').isNumeric().trim().escape(),
                check('status').custom((value: String) => {
                    return (Object.values(ExchangeStatus) as String[]).includes(value);
                }).trim().escape(),
            ],
            this.putOne);
        this.router.delete('/:id', this.deleteOne);
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
     * GET exchange by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction 
     */
     public getOne = async (req: Request, res: Response, next: NextFunction) => {
        const exchangeId = req.params.id;
        if (exchangeId === undefined || exchangeId === null) {
            res.status(400).send("Error, parameter id is missing or wrong").end();
            return;
        } else {
            res.send(await this.exchangeService.findById(parseInt(exchangeId, 10)))
            return;
        }
    }

    /**
     * Validate the exchange
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public validateExchange = async (req: Request, res: Response, next: NextFunction) => {
        const exchangeId = req.params.id;
        if (exchangeId === undefined || exchangeId === null) {
            res.status(400).send("Error, parameter id is missing or wrong").end();
            return;
        } else {
            // Get the exchange to validate
            const exchange = await this.exchangeService.findById(parseInt(exchangeId, 10));

            if (exchange !== undefined) {
                // Verify that the user who validate is the right one
                const user = await this.userService.findById(res.locals.user.id);
                if (user === undefined) {
                    Logger.error("User no found => id: " + res.locals.user.id);
                    res.status(403).send("Unauthorized").end();
                    return;
                } else {
                    // Body validation is now complete
                    const responseCode = await this.exchangeService.validate(exchange, user);

                    switch (responseCode) {
                        case CallBack.Status.DB_ERROR: {
                            res.status(404)
                                .send("An error occurred while validating the exchange. Please try later and verify values sent").end();
                            break;
                        }
                        case CallBack.Status.LOGIC_ERROR: {
                            res.status(401)
                                .send("Unauthorized to validate this exchange")
                                .end();
                            break;
                        }
                        case CallBack.Status.FAILURE: {
                            res.status(404)
                                .send("Fail to validate the exchange. Please try later or verify values sent")
                                .end();
                            break;
                        }
                        case CallBack.Status.SUCCESS: {
                            res.end();
                            break;
                        }
                        default:
                            res.end();
                            break;
                    }
                }
            } else {
                Logger.error("Exchange not found => id: " + exchangeId);
                res.status(404).send("Entity not found").end();
                return;
            }
        }
    }

    /**
     * Cancel the exchange
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public cancelExchange = async (req: Request, res: Response, next: NextFunction) => {
        const exchangeId = req.params.id;
        if (exchangeId === undefined || exchangeId === null) {
            res.status(400).send("Error, parameter id is missing or wrong").end();
            return;
        } else {
            // Get the exchange to validate
            const exchange = await this.exchangeService.findById(parseInt(exchangeId, 10));

            if (exchange !== undefined) {
                // Verify that the user who validate is the right one
                const user = await this.userService.findById(res.locals.user.id);
                if (user === undefined) {
                    Logger.error("User no found => id: " + res.locals.user.id);
                    res.status(403).send("Unauthorized").end();
                } else {
                    // Body validation is now complete
                    const responseCode = await this.exchangeService.cancel(exchange, user);
                    switch (responseCode) {
                        case CallBack.Status.DB_ERROR: {
                            res.status(404)
                                .send("An error occurred while validating the exchange. Please try later and verify values sent").end();
                            break;
                        }
                        case CallBack.Status.LOGIC_ERROR: {
                            res.status(401)
                                .send("Unauthorized to validate this exchange")
                                .end();
                            break;
                        }
                        case CallBack.Status.FAILURE: {
                            res.status(404)
                                .send("Fail to validate the exchange. Please try later or verify values sent")
                                .end();
                            break;
                        }
                        case CallBack.Status.SUCCESS: {
                            res.end();
                            break;
                        }
                        default: break;
                    }
                }
            } else {
                Logger.error("Exchange not found => id: " + exchangeId);
                res.status(404).send("Entity not found").end();
                return;
            }
        }
    }

    /**
     * POST exchange
     * @param req Express Request 
     * @param res Express Response
     * @param next Express NextFunction
     */
     public postOne = async (req: Request, res: Response, next: NextFunction) => {
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
    public putOne = async (req: Request, res: Response, next: NextFunction) => {
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
     public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
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
