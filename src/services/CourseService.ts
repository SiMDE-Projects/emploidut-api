import { getCustomRepository } from "typeorm";
import { CourseRepository } from "../repository/CourseRepository";
import { UserRepository } from "../repository/UserRepository";
import CallBack from "./FunctionStatusCode";
import Logger from "./Logger";

/**
 * Course service class
*/
export class CourseService {

    private courseRepository: CourseRepository;
    private userRepository: UserRepository;

    constructor() {
        this.courseRepository = getCustomRepository(CourseRepository);
        this.userRepository = getCustomRepository(UserRepository);
    }

    /**
     * Get course by id
     * @param id 
     * @returns Course | undefined
     */
    public findOne = async (id: String) => {
        const course = await this.courseRepository.findById(id);
        return course;
    }

    /**
     * Get users from course's id
     * @param id 
     * @returns User[]
     */
    public findUsers = async (id: String) => {
        const users = await this.userRepository.findUsersByCourse(id);
        return users;
    }

    /**
     * 
     * @returns Course[] | undefined
     */
    public findAll = async () => {
        const courses = await this.courseRepository.find();
        return courses;
    }

    /**
     * Create a new Course entity
     * @param body Validated body of the request
     * @returns Status code
     */
     public create = async (body: Object) => {
        try {
            const course = await this.courseRepository.save(body);
            if (course !== undefined || course !== null) {
                // Success
                return CallBack.Status.SUCCESS;
            }

            // Error while creating the new course (the course already exists)
            return CallBack.Status.FAILURE;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * Update one Course
     * @param body Validated body of the request
     * @returns Status code
     */
     public update = async (body: Object, id: number) => {
        try {
            const course = await this.courseRepository.findOne(id);
            if (course !== undefined) {
                this.courseRepository.merge(course, body);
                const courseResult = await this.courseRepository.save(course);
                if (courseResult !== undefined || courseResult !== null) {
                    // Success
                    return CallBack.Status.SUCCESS;
                }

                // Error while creating the new course (the course already exists)
                return CallBack.Status.FAILURE;
            }
            return CallBack.Status.LOGIC_ERROR;
        } catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }

    /**
     * 
     * @param id Course's id to delete
     * @returns Status code
     */
     public delete = async (id: number) => {
        try {
            const results = await this.courseRepository.delete(id);
            return results.affected;
        }  catch (err) {
            Logger.error(err);
            return CallBack.Status.DB_ERROR;
        }
    }
}
