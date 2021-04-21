import { getRepository } from "typeorm";
import { TimeSlot } from "../entity/TimeSlot";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";

export class UserController {
    /**
     * GET users for one student (login)
     * Expect the login in queryParams
    */
    public static getUsers = async (req?: any, res?: any, next?: any) => {
        // Get users by timeSlot
        const timeSlotQueryParam = req.query.timeSlot;
        if(timeSlotQueryParam !== undefined && timeSlotQueryParam !== null){
            const timeSlot = await getRepository(TimeSlot).findOne({id: req.query.login});
            console.log("TimeSlots: ", timeSlot);
            //Check if the user exist
            if (timeSlot !== null && timeSlot !== undefined) {
                res.json(UserService.getUsersByTimeSlots(timeSlotQueryParam)).end();
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
    public static postUsers = async (req?: any, res?: any, next?: any) => {}

    /**
     * PUT users for one student (login)
     * Expect the login in queryParams
    */
    public static putUsers = async (req?: any, res?: any, next?: any) => {}
}