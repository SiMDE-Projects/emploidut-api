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

    public routes(){
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getgroups);
        this.router.post(
            '/',
            [
                check('title').exists().withMessage('Field "title" is missing').trim().escape(),
                check('users')
                    .exists().withMessage('Field "users" is missing')
                    .isArray().isUUID()
            ],
            this.postgroups);
        this.router.put(
            '/:id',
            [
                check('title').trim().escape(),
                check('users')
                    .exists().withMessage('Field "users" is missing')
                    .isArray().isUUID()
            ],
            this.putgroups);
        this.router.delete('/:id', this.delete);
    }

    /**
     * GET group by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
     public findOne = async (req: Request, res: Response, next: NextFunction) => {
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
     * GET all groups
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
    public getgroups = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET groups');
        // Return every groups in DB
        const groups = await this.groupService.findAll();
        res.send(groups).end();
        return;
    }

    /**
     * POST group
     * @param req Express Request 
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postgroups = async (req: Request, res: Response, next: NextFunction) => {
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
    public putgroups = async (req: Request, res: Response, next: NextFunction) => {
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
     public delete = async (req: Request, res: Response, next: NextFunction) => {
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
