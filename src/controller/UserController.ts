import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserController {
    /**
     * GET users for one student (login)
     * Expect the login in queryParams
    */
    public static getUsers = async (req?: any, res?: any, next?: any) => {
        if (req.query.login !== undefined && req.query.login !== null) {
            const users = await getRepository(User).find({ id: req.query.login });
            res.json(users);
        } else {
            const users = await getRepository(User).find();
            res.json(users);
        }
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