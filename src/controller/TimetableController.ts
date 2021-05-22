import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { TimeTableService } from "../services/TimetableService";

export class TimetableController {

    private timeTableService: TimeTableService;
    public router: Router;

    constructor() {
        this.timeTableService = new TimeTableService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/emploidut', this.getEmploidut);
    }

    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public getEmploidut = async (req: Request, res: Response, next?: any) => {
        if (req.query.login) {
            const user = await getRepository(User).findOne({ id: req.query.login });

            if (user === null || user === undefined) {
                res.status(404).send('Sorry user not found!').end();
            }

            // TODO: Add findEmploidut method 
            // const emploidut = await getRepository(--).findEmploidut(req.query.login);
            // res.json(emploidut); 
        } else {
            // Send error 404 error
            res.status(404).send('Parameter is missing!').end();
        }
    }
}
