import { UserService } from "../services/UserService";
import { NextFunction, Request, Response, Router } from "express";
import CallBack from "../services/FunctionStatusCode";
import { check, ValidationError, validationResult } from "express-validator";
import Logger from "../services/Logger";
import { TimeSlotService } from "../services/TimeSlotService";

export class UserController {

    private userService: UserService;
    public timeSlotService: TimeSlotService;
    public router: Router;

    constructor() {
        this.userService = new UserService();
        this.timeSlotService = new TimeSlotService();
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getOne);
        this.router.get('/timeslot/:id', this.findUsersByTimeSlot);
        this.router.post(
            '/',
            [
                check('id').exists().withMessage('Field "id" is missing')
                    .isUUID().trim().escape(),
                check('login').exists().withMessage('Field "login" is missing')
                    .trim().escape().isLength({ max: 10 }),
                check('enableConsultation').exists().withMessage('Field "enableConsultation" is missing')
                    .isBoolean().trim().escape(),
                check('enableViewing').exists().withMessage('Field "enableViewing" is missing')
                    .isBoolean().trim().escape(),
            ],
            this.postOne);
        this.router.put(
            '/:id',
            [
                check('login').trim().escape().isLength({ max: 10 }),
                check('enableConsultation').isBoolean().trim().escape(),
                check('enableViewing').isBoolean().trim().escape(),
            ],
            this.putOne);
        this.router.delete('/:id', this.deleteOne);
    }

    /**
     * GET users
     * TODO: Add criteria in research
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET Users');

        // Get users by timeSlot
        const timeSlotQueryParam = req.query.timeslot;
        if(timeSlotQueryParam !== undefined && timeSlotQueryParam !== null){
            const timeSlot = await this.timeSlotService.findById(parseInt(String(req.query.login)));

            //Check if the user exist
            if (timeSlot !== null && timeSlot !== undefined) {
                // Process request
                return;
            } else {
                res.status(404).send('Entity not found').end();
                return;
            }
        }

        // Get users by login
        const loginQueryParam = req.query.login;
        if (loginQueryParam !== undefined && loginQueryParam !== null) {
            const user = await this.userService.findByLogin(String(loginQueryParam));
            res.json(user).end();
            return;
        }

        // Get all users -> TODO: Check permissions
        const users = await this.userService.findAll();
        res.json(users).end();
        return;
    }

    /**
     * GET user by id
     * @param req Express Request
     * @param res 
     * @param next 
     * @returns 
     */
    public getOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET One User');

        const userId = req.params.id;
        if (userId === undefined || userId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        }
        else{
            res.send(await this.userService.findById(parseInt(userId!)));
            return;
        }
    }

    /**
     * GET user by id
     * @param req Express Request
     * @param res 
     * @param next 
     * @returns 
     */
    public findUsersByTimeSlot = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET User by TimeSolt');

        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        }
        else{
            res.send(await this.userService.findUsersByTimeSlot(parseInt(timeSlotId!)));
            return;
        }
    }

    /**
     * POST user
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('POST User');

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
        const responseCode = await this.userService.create(req.body)
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
     * PUT user
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
     public putOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('PUT User');

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
        const userId = req.params.id;
        if (userId === undefined || userId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            // Body validation and path validation are now complete
            const responseCode = await this.userService.update(req.body, parseInt(userId!, 10));
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
     * DELETE user 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
        // Check path id
        const userId = req.params.id;
        if (userId === undefined || userId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        } else {
            const response = await this.userService.delete(parseInt(userId!, 10));
            res.end();
            return;
        }
    }
}