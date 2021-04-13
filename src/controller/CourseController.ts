import { getRepository } from "typeorm";
import { Course } from "../entity/Course";

export class CourseController {
    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static getCourses = async (req?: any, res?: any, next?: any) => {
        if (req.query.uv !== undefined && req.query.uv !== null) {
            const courses = await getRepository(Course).find({ id: req.query.uv });
            res.json(courses);
        } else {
            const courses = await getRepository(Course).find();
            res.json(courses);
        }
    }

    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static postCourses = async (req?: any, res?: any, next?: any) => {}

    /**
     * PUT courses for one student (login)
     * Expect the login in queryParams
    */
    public static putCourses = async (req?: any, res?: any, next?: any) => {}
}