import { NextFunction, Request, Response, Router } from "express";
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
        this.router.get('/', this.getEmploidut);
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
        const login = <String> req.query.login;
        if (login) {
            Logger.debug('GET Emploidut from another login');
            const user = await this.userService.findByLogin(login);
            if (user !== undefined) {
                const timeTable = await this.timeTableService.findTimeTable(user);
                res.send(timeTable).end();
                return;
            } else {
                res.status(404).send('User not found').end();
                return;
            }
        }
        else {
            Logger.debug('GET Emploidut for the requester user');
            const requestUser = res.locals.user;
            if (requestUser === undefined || requestUser === null) {
                res.status(404).send('User not found').end();
                return;
            } else {
                const user = await this.userService.findUser(requestUser.id);
                if (user !== undefined) {
                    const timeTable = await this.timeTableService.findTimeTable(user);
                    res.send(timeTable).end();
                    return;
                } else {
                    // The user is not in DB --> Store him/her and him/her timeTable (emploidut)
                    res.end();
                    return;
                }
            }
        }
    }
}
