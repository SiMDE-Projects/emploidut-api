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
        if(req.query.timeSlot !== undefined && req.query.timeSlot !== null){
            const timeSlot = await getRepository(TimeSlot).find({id: req.query.login});
            console.log("TimeSlots: ", timeSlot);
            //Check if the user exist
            if (timeSlot !== null && timeSlot !== undefined && timeSlot.length > 0) {
                res.json(UserService.getUsersByTimeSlots(req.query.timeSlot)).end();
                return;
            } else {
                res.status(404).send('Entity not found').end();
                return;
            }
        }

        // Get users by login
        if (req.query.login !== undefined && req.query.login !== null) {
            const user = await getRepository(User).find({ id: req.query.login });
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