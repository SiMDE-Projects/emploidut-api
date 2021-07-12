import { NextFunction, Request, Response, Router } from "express";
import { check, Result, ValidationError, validationResult } from 'express-validator';
import { Course, courseType } from "../entity/Course";
import { CourseService } from "../services/CourseService";
import CallBack from "../services/FunctionStatusCode";
import Logger from "../services/Logger";

export class CourseController {

    private courseService: CourseService;
    public router: Router;

    constructor() {
        this.courseService = new CourseService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getCourses);
        this.router.post(
            '/',
            [
                check('id').exists().withMessage('Field "id" is missing').isAlphanumeric().trim().escape(),
                check('name').exists().withMessage('Field "name" is missing').trim().escape(),
                check('type')
                    .exists().withMessage('Field "type" is missing')
                    .custom((value: String) => {
                        return (Object.values(courseType) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.postCourses);
        this.router.put(
            '/:id',
            [
                check('id').trim().escape(),
                check('name').trim().escape(),
                check('type').custom((value: String) => {
                        return (Object.values(courseType) as String[]).includes(value);
                    }).trim().escape(),
            ],
            this.putCourses);
    }

    /**
     * GET course by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public findOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET One Course');
        const courseId = req.params.id;
        if (courseId === undefined || courseId === null) {
            res.status(400).send("Error, parameter id is missing or wrong").end();
            return;
        }
        else {
            const course = await this.courseService.findOne(courseId);
            if (course === undefined  || course === null) {
                // Send 404 error
                res.status(404).send('Entity not found').end();
                return;
            }

            // Send course found
            res.send(course).end();
            return;
        }
    }

    /**
     * GET all courses
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
    public getCourses = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET Courses');
        // Return every courses in DB
        const courses = await this.courseService.findAll();
        res.send(courses).end();
        return;
    }

    /**
     * POST course
     * @param req Express Request 
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postCourses = async (req: Request, res: Response, next: NextFunction) => {
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
        const responseCode = await this.courseService.create(req.body)
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
     * PUT course
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putCourses = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('PUT Course');
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
        const courseId = req.params.id;
        if (courseId === undefined || courseId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            // Body validation and path validation are now complete
            const responseCode = await this.courseService.update(req.body, parseInt(courseId!, 10));
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
     * DELETE course 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
     public delete = async (req: Request, res: Response, next: NextFunction) => {
        // Check path id
        const courseId = req.params.id;
        if (courseId === undefined || courseId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        } else {
            const response = await this.courseService.delete(parseInt(courseId!, 10));
            res.end();
            return;
        }
    }
}