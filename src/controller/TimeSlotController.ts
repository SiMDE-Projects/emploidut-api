import { NextFunction, Request, Response, Router } from "express";
import { TimeSlot } from "../entity/TimeSlot";
import { TimeSlotService } from "../services/TimeSlotService";

export class TimeSlotController {
    private timeSlotService: TimeSlotService;
    public router: Router;

    constructor() {
        this.timeSlotService = new TimeSlotService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/', this.getTimeSlots);
        this.router.post('/', this.postTimeSlots);
        this.router.put('/', this.putTimeSlots);
    }

    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        const timeSlotId = req?.params.id;
        if (typeof timeSlotId === undefined || timeSlotId === null) {
            res?.status(400).send("Error, parameter id is missing or wrong");
        }
        else{
            res?.send(await this.timeSlotService.findTimeSlot(parseInt(timeSlotId!, 10)))
        }
        //res?.send(await getCustomRepository(UserRepository).findById(1));
        //res?.send(await this.userService.findUser(parseInt("1")))
    }

    /** 
     * GET timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public getTimeSlots = async (req: Request, res: Response, next: NextFunction) => {

    }

    /** 
     * POST timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public postTimeSlots = async (req: Request, res: Response, next: NextFunction) => {}

    /** 
     * PUT timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public putTimeSlots = async (req: Request, res: Response, next: NextFunction) => {}
}
