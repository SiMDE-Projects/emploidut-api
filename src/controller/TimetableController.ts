import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";
import { TimeTableService } from "../services/TimetableService";

export class TimetableController {

    private timeTableService: TimeTableService;
    private userRepository: UserRepository;
    public router: Router;

    constructor() {
        this.timeTableService = new TimeTableService();
        this.userRepository = new UserRepository();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/emploidut', this.getEmploidut);
    }

    /**
     * GET emploidut for one student -> WIP
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns 
     */
    public getEmploidut = async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.login) {
            const user = await this.userRepository.findByLogin(String(req.query.login));

            if (user === null || user === undefined) {
                res.status(404).send('Sorry user not found!').end();
                return;
            }

            // TODO: Add findEmploidut method 
            // const emploidut = await getRepository(--).findEmploidut(req.query.login);
            // res.json(emploidut); 
        } else {
            // Send error 404 error
            res.status(404).send('Parameter is missing!').end();
            return;
        }
    }
}
