import { NextFunction, Request, Response, Router } from "express";
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
        this.router.get('/:id', this.findOne);
        this.router.get('/', this.getCourses);
        this.router.post('/', this.postCourses);
        this.router.put('/', this.putCourses);
    }

    /**
     * GET course by id 
    */
     public findOne = async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.id;
        if (courseId === undefined || courseId === null) {
            res.status(400).send("Error, parameter id is missing or wrong");
        }
        else {
            const course = await this.courseService.findOne(courseId);
            if (course === undefined  || course === null) {
                // Send 404 error
                res.status(404).send('Entity not found').end();
                return;
            }

            // Send course found
            res.json(course);
            return;
        }
    }

    /**
     * GET courses 
    */
    public getCourses = async (req: Request, res: Response, next: NextFunction) => {
        // Return every courses in DB
        const courses = await this.courseService.findAll();
        res.json(courses);
        return;
    }

    /**
     * POST courses
    */
    public postCourses = async (req: Request, res: Response, next: NextFunction) => {}

    /**
     * PUT courses
    */
    public putCourses = async (req: Request, res: Response, next: NextFunction) => {}
}