import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { Course } from "../entity/Course";
import { CourseService } from "../services/CourseService";

export class CourseController {

    private courseService: CourseService;
    public router: Router;

    constructor() {
        this.courseService = new CourseService();
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.get('/', this.getCourses);
        this.router.post('/', this.postCourses);
        this.router.put('/', this.putCourses);
    }

    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public getCourses = async (req: Request, res: Response, next?: any) => {

        // Check if there is a query named course
        const courseQueryParam = req.query.course;
        if (courseQueryParam !== undefined && courseQueryParam !== null) {
            const course = await getRepository(Course).findOne({ id: String(courseQueryParam) });
            
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
    public postCourses = async (req: Request, res: Response, next?: any) => {}

    /**
     * PUT courses for one student (login)
     * Expect the login in queryParams
    */
    public putCourses = async (req: Request, res: Response, next?: any) => {}
}