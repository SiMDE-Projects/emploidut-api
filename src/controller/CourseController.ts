import { Course } from '../entity/Course';

export class CourseController {
    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static getCourses = async (req?: any, res?: any, next?: any) => {
        const  course = new Course();
        res.send(`user : ${req.query.login}, login : ${course.id}`);
    }

    /**
     * GET courses for one student (login)
     * Expect the login in queryParams
    */
    public static postCourses = async (req?: any, res?: any, next?: any) => {
        const course = new Course();
        res.send(`user : ${req.query.login}, login : ${course.id}`);
    }

    /**
     * PUT courses for one student (login)
     * Expect the login in queryParams
    */
    public static putCourses = async (req?: any, res?: any, next?: any) => {
        const course = new Course();
        res.send(`user : ${req.query.login}, login : ${course.id}`);
    }

}