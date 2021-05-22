import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { Request, Response, Router } from "express";

export class UserController {

    private userService: UserService;
    public router: Router;

    constructor() {
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/:id', this.getOneUser);
        this.router.get('/', this.getUsers);
        this.router.post('/', this.postUsers);
        this.router.put('/', this.putUsers);
    }

    public getOneUser = async (req: Request, res: Response, next?: any) => {

        const userId = req?.params.id;
        if (typeof userId === undefined || userId === null) {
            res?.status(400).send("Error, parameter id is missing or wrong");
        }
        else{
            res?.send(await this.userService.findUser(parseInt(userId!)))
        }
        //res?.send(await getCustomRepository(UserRepository).findById(1));
        //res?.send(await this.userService.findUser(parseInt("1")))
    }

    /**
     * GET users for one student (login)
     * Expect the login in queryParams
    */
     public getUsers = async (req: Request, res: Response, next?: any) => {
        // Get users by timeSlot
        const timeSlotQueryParam = req.query.timeSlot;
        if(timeSlotQueryParam !== undefined && timeSlotQueryParam !== null){
            const timeSlot = await getRepository(TimeSlot).findOne({id: parseInt(String(req.query.login))});
            console.log("TimeSlots: ", timeSlot);
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
            console.log("User by login:", user);
            res.json(user).end();
            return;
        }

        // Get all users -> TODO: Check permissions
        const users = await getRepository(User).find();
        res.json(users).end();
        return;
    }

    /**
     * GET users for one student (login)
     * Expect the login in queryParams
    */
    public postUsers = async (req: Request, res: Response, next?: any) => {}

    /**
     * PUT users for one student (login)
     * Expect the login in queryParams
    */
    public putUsers = async (req: Request, res: Response, next?: any) => {}
}