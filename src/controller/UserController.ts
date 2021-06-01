import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response, Router } from "express";

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
        this.router.post('/', this.postUsers);
        this.router.put('/', this.putUsers);
    }

    /**
     * GET user by id
     * @param req Express Request
     * @param res 
     * @param next 
     * @returns 
     */
    public findOne = async (req: Request, res: Response, next: NextFunction) => {
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
    public postUsers = async (req: Request, res: Response, next: NextFunction) => {}

    /**
     * PUT user
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putUsers = async (req: Request, res: Response, next: NextFunction) => {}
}