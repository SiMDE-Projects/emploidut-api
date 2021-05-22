import {Connection, getCustomRepository, getRepository} from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { UserRepository} from "../repository/UserRepository";
import {Request, Response, Router} from "express";

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
    }

    public findOne = async (req?: Request, res?: Response, next?: any) => {

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

}