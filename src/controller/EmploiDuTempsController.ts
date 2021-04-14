import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class EmploiDuTempsController {
    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static getEmploidut = async (req?: any, res?: any, next?: any) => {
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
