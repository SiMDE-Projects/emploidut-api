import { NextFunction, Request, Response, Router } from "express";
import { check } from "express-validator";
import CallBack from "../services/FunctionStatusCode";
import Logger from "../services/Logger";
import { TimeTableService } from "../services/TimetableService";
import { UserService } from "../services/UserService";

export class TimetableController {

    private timeTableService: TimeTableService;
    private userService: UserService;
    public router: Router;

    constructor() {
        this.timeTableService = new TimeTableService();
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/',
        [
            check('login').trim().escape(),
        ],
        this.getEmploidut);
    }

    /**
     * GET emploidut for one student -> WIP
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
    public getEmploidut = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('GET Emploidut');
        const login = req.query.login;
        if (login !== undefined && login !== null) {
            Logger.debug('GET Emploidut from another login');
            const user = await this.userService.findByLogin(String(login));
            if (user !== undefined) {
                const timeTable = await this.timeTableService.findTimeTable(user);
                res.send(timeTable).end();
                return;
            } else {
                res.status(404).send('User not found').end();
                return;
            }
        } else {
            Logger.debug('GET Emploidut for the requester user');
            const requestUser = res.locals.user;
            if (requestUser === undefined || requestUser === null) {
                res.status(404).send('User not found').end();
                return;
            } else {
                const user = await this.userService.findById(requestUser.id);
                if (user !== undefined) {
                    const timeTable = await this.timeTableService.findTimeTable(user);
                    res.send(timeTable).end();
                    return;
                } else {
                    // The user is not in DB --> Store him/her and him/her timeTable (emploidut)
                    const responseCodeUser = await this.userService.create(requestUser);
                    if (responseCodeUser === CallBack.Status.SUCCESS) {
                        const responseCodeTimeTable = await this.timeTableService.create(requestUser);
                        if (responseCodeTimeTable === CallBack.Status.SUCCESS) {
                            return;
                        } else {
                            res.status(404).send("An error occurred while creating the timeTable. Please try later and verify values sent").end();
                            return;
                        }
                    } else {
                        res.status(404).send("An error occurred while creating the new user. Please try later and verify values sent").end();
                        return;
                    }
                }
            }
        }
    }
}
