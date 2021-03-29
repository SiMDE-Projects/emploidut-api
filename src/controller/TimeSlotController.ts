import { TimeSlot } from "../entity/TimeSlot";

export class TimeSlotController {
    /** 
     * GET timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public static getTimeSlots = async (req?: any, res?: any, next?: any) => {
        const timeSlot = new TimeSlot();
        res.send(`user : ${req.query.login}, login : ${timeSlot.id}`);
    }

    /** 
     * POST timeSlots for one student (login)
     * Expect the login in queryParams
    */
    public static postTimeSlots = async (req?: any, res?: any, next?: any) => {
        const timeSlot = new TimeSlot();
        res.send(`user : ${req.query.login}, login : ${timeSlot.id}`);
    }

    /** 
     * PUT timeSlots for one student (login)
     * Expect the login in queryParams
    */
     public static putTimeSlots = async (req?: any, res?: any, next?: any) => {
        const timeSlot = new TimeSlot();
        res.send(`user : ${req.query.login}, login : ${timeSlot.id}`);
    }
}
