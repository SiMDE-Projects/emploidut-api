import { Request, Response, Router } from "express";
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

    /** 
     * GET timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public getTimeSlots = async (req: Request, res: Response, next?: any) => {}

    /** 
     * POST timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public postTimeSlots = async (req: Request, res: Response, next?: any) => {}

    /** 
     * PUT timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public putTimeSlots = async (req: Request, res: Response, next?: any) => {}
}
