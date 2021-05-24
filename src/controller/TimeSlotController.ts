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
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getTimeSlots);
        this.router.post('/', this.postTimeSlots);
        this.router.put('/', this.putTimeSlots);
    }

    /**
     * GET timeSlots by id
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        const timeSlotId = req.params.id;
        if (timeSlotId === undefined || timeSlotId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
            return;
        }
        else{
            res.send(await this.timeSlotService.findTimeSlot(parseInt(timeSlotId!, 10)))
            return;
        }
    }

    /**
     * GET timeSlots
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public getTimeSlots = async (req: Request, res: Response, next: NextFunction) => {

    }

    /**
     * POST timeSlots
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public postTimeSlots = async (req: Request, res: Response, next: NextFunction) => {}

    /**
     * PUT timeSlots 
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public putTimeSlots = async (req: Request, res: Response, next: NextFunction) => {}
}
