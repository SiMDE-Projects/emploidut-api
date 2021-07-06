import { NextFunction, Request, Response, Router } from "express";
import { check, ValidationError, validationResult } from "express-validator";
import { TimeSlot, timeSlotType, frequencyType, TimeSlotCriteria } from "../entity/TimeSlot";
import CallBack from "../services/FunctionStatusCode";
import Logger from "../services/Logger";
import { TimeSlotService } from "../services/TimeSlotService";

export class TimeSlotController {
    private timeSlotService: TimeSlotService;
    public router: Router;

    constructor() {
        this.timeSlotService = new TimeSlotService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/:id', this.findOne);
        this.router.get('/:id/users', this.findUsers);
        this.router.get('/', this.getTimeSlots);
        this.router.get('/course/:id', this.getCourseTimeSlots);
        this.router.post(
            '/',
            [
                check('name').exists().withMessage('Field "name" is missing').notEmpty().trim().escape(),
                check('roomNumber').exists().withMessage('Field "roomNumber" is missing').notEmpty().trim().escape(),
                check('startAt')
                    .exists().withMessage('Field "startAt" is missing')
                    .trim().escape()
                    .matches(/^(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4])$/).withMessage('Field "startAt" must be a valid date'),
                check('endAt')
                    .exists().withMessage('Field "endAt" is missing')
                    .trim().escape()
                    .matches(/^(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4])$/).withMessage('Field "endAt" must be a valid date'),
                check('course').exists().withMessage('Field "course" is missing').isAlphanumeric().trim().escape(),
                check('type')
                    .exists().withMessage('Field "type" is missing')
                    .custom((value: String) => {
                        return (Object.values(timeSlotType) as String[]).includes(value);
                    }).trim().escape(),
                check('frequency')
                    .exists().withMessage('Field "type" is missing')
                    .custom((value: String) => {
                        return (Object.values(frequencyType) as String[]).includes(value);
                    }).trim().escape(),
                check('day')
                    .exists().withMessage('Field "day" is missing')
                    .custom((value: String) => {
                        return (Object.values(dayType) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.postTimeSlots);
        this.router.put(
            '/:id',
            [
                check('name').trim().escape(),
                check('roomNumber').trim().escape(),
                check('startAt').trim().escape()
                    .matches(/^(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4])$/).withMessage('Field "startAt" must be a valid date'),
                check('endAt').trim().escape()
                    .matches(/^(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-4])$/).withMessage('Field "endAt" must be a valid date'),
                check('course').exists().withMessage('Field "course" is missing').isAlphanumeric().trim().escape(),
                check('type').custom((value: String) => {
                        return (Object.values(timeSlotType) as String[]).includes(value);
                    }).trim().escape(),
                check('frequency').custom((value: String) => {
                        return (Object.values(frequencyType) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.putTimeSlots);
        this.router.delete('/:id', this.delete);
    }

    /**
     * GET timeSlots by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET One TimeSolt');
        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            res.send(await this.timeSlotService.findTimeSlot(parseInt(timeSlotId!, 10)))
            return;
        }
    }

    /**
     * GET users by timeSlot
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public findUsers = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET Users by TimeSolt');
        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            res.send(await this.timeSlotService.findUsers(parseInt(timeSlotId!, 10)))
            return;
        }
    }

    /**
     * GET timeSlots
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public getTimeSlots = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET TimeSolts');
        const queryParams = req.query;
        if (queryParams !== undefined || queryParams !== null) {
            Logger.debug('GET TimeSolts by criteria');
            const criteria = new TimeSlotCriteria(queryParams);
            const timeSlots = await this.timeSlotService.findByCriteria(criteria);
            res.json(timeSlots).end();
            return;
        } else {
            Logger.debug('GET all TimeSolts');
            // Get all users 
            const timeSlots = await this.timeSlotService.findAll();
            res.json(timeSlots).end();
            return;
        }
    }

    /**
     * GET timeSlots by course's id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
     public getCourseTimeSlots = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET Course by TimeSolt');
        const courseId = req.params.id;
        if (courseId === undefined || courseId === null || courseId === '') {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            res.send(await this.timeSlotService.findTimeSlotByCourse(courseId));
            return;
        }
    }

    /**
     * POST timeSlots
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postTimeSlots = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('POST TimeSolt');
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
        const responseCode = await this.timeSlotService.create(req.body);
        switch (responseCode) {
            case CallBack.Status.DB_ERROR: {
                res.status(404).send("An error occurred while creating the entity. Please try later and verify values sent").end();
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

    /**
     * PUT timeSlots 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putTimeSlots = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('PUT TimeSolt');
        // Check if there are format errors
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {            
            return `${location}[${param}]: ${msg}`;
        };

        // Check if there are validation errors
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            res.status(404).send({ errors: result.array() }).end();
            return CallBack.Status.FAILURE;
        }

        // Check path id
        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            // Body validation and path validation are now complete
            const responseCode = await this.timeSlotService.update(req.body, parseInt(timeSlotId!, 10));
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
     * DELETE timeSlots 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        // Check path id
        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        } else {
            const response = await this.timeSlotService.delete(parseInt(timeSlotId!, 10));
            res.end();
            return;
        }
    }
}
