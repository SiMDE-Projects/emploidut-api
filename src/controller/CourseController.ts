import { getRepository } from "typeorm";
import { Course } from "../entity/Course";

export class CourseController {
    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static getCourses = async (req?: any, res?: any, next?: any) => {

        // Check if there is a query named course
        const courseQueryParam = req.query.course;
        if (courseQueryParam !== undefined && courseQueryParam !== null) {
            const course = await getRepository(Course).findOne({ id: courseQueryParam });
            
            if (course === undefined  || course === null) {
                // Send 404 error
                res.status(404).send('Entity not found').end();
                return;
            }

            res.json(course);
            return;
        } else {
            // Return every courses in DB
            const courses = await getRepository(Course).find();
            res.json(courses);
            return;
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