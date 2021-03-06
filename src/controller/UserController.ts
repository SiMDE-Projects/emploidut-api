import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response, Router } from "express";
import CallBack from "../services/FunctionStatusCode";
import { check, ValidationError, validationResult } from "express-validator";
import Logger from "../services/Logger";

export class UserController {

    private userService: UserService;
    public router: Router;

    constructor() {
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getUsers);
        this.router.post(
            '/',
            [
                check('login').exists().withMessage('Field "login" is missing')
                    .trim().escape().isLength({ max: 10 }),
                check('enableConsultation').exists().withMessage('Field "enableConsultation" is missing')
                    .isBoolean().trim().escape(),
                check('enableViewing').exists().withMessage('Field "enableViewing" is missing')
                    .isBoolean().trim().escape(),
            ],
            this.postUsers);
        this.router.put(
            '/:id',
            [
                check('login').trim().escape().isLength({ max: 10 }),
                check('enableConsultation').isBoolean().trim().escape(),
                check('enableViewing').isBoolean().trim().escape(),
            ],
            this.putUsers);
        this.router.delete('/:id', this.deleteUsers);
    }

    /**
     * GET user by id
     * @param req Express Request
     * @param res 
     * @param next 
     * @returns 
     */
    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET One User');

        const userId = req?.params.id;
        if (userId === undefined || userId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        }
        else{
            res.send(await this.userService.findUser(parseInt(userId!)));
            return;
        }
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
        const timeSlotQueryParam = req.query.timeSlot;
        if(timeSlotQueryParam !== undefined && timeSlotQueryParam !== null){
            const timeSlot = await getRepository(TimeSlot).findOne({id: parseInt(String(req.query.login))});

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
            const user = await getRepository(User).findOne({ id: loginQueryParam });
            res.json(user).end();
            return;
        }

        // Get all users -> TODO: Check permissions
        const users = await getRepository(User).find();
        res.json(users).end();
        return;
    }

    /**
     * POST user
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postUsers = async (req: Request, res: Response, next: NextFunction) => {
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
     public putUsers = async (req: Request, res: Response, next: NextFunction) => {
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
    public deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
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