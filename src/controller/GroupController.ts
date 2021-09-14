import { NextFunction, Request, Response, Router } from "express";
import { check, ValidationError, validationResult } from 'express-validator';
import CallBack from "../services/FunctionStatusCode";
import Logger from "../services/Logger";
import { GroupService } from "../services/GroupService";
import { UserService } from "../services/UserService";

export class GroupController {

    private groupService: GroupService;
    private userService: UserService;
    public router: Router;

    constructor() {
        this.groupService = new GroupService();
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/', this.getGroups);
        this.router.get('/:id', this.getOne);
        this.router.post(
            '/',
            [
                check('title').exists().withMessage('Field "title" is missing').trim().escape(),
                check('users')
                    .exists().withMessage('Field "users" is missing')
                    .isArray().isUUID()
            ],
            this.postOne);
        this.router.put(
            '/:id',
            [
                check('title').trim().escape(),
                check('users')
                    .exists().withMessage('Field "users" is missing')
                    .isArray().isUUID()
            ],
            this.putOne);
        this.router.delete('/:id', this.deleteOne);
    }

    /**
     * GET all groups
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public getGroups = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET groups');
        // Return every groups in DB
        const groups = await this.groupService.findAll();
        res.send(groups).end();
        return;
    }

    /**
     * GET group by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public getOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET One Group');
        const groupId = req.params.id;
        if (groupId === undefined || groupId === null) {
            res.status(400).send("Error, parameter id is missing or wrong").end();
            return;
        }
        else {
            const group = await this.groupService.findOne(groupId);
            if (group === undefined  || group === null) {
                res.status(404).send('Entity not found').end();
                return;
            }

            // Send group found
            res.send(group).end();
            return;
        }
    }

    /**
     * POST group
     * @param req Express Request 
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('POST group');
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

        // Get the requester user
        const user = await this.userService.findById(res.locals.user.id);

        if (user !== undefined) {
            // Body validation is now complete
            const responseCode = await this.groupService.create(req.body, user)
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
        }
        
        return;
    }

    /**
     * PUT group
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putOne = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('PUT group');
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
        const groupId = req.params.id;
        if (groupId === undefined || groupId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        } else {
            // Body validation and path validation are now complete
            const responseCode = await this.groupService.update(req.body, parseInt(groupId!, 10));
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
     * DELETE group 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
     public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
        // Check path id
        const groupId = req.params.id;
        if (groupId === undefined || groupId === null) {
            res.status(404).send("Error, parameter id is missing or wrong");
            return;
        } else {
            const response = await this.groupService.delete(parseInt(groupId!, 10));
            res.end();
            return;
        }
    }
}
