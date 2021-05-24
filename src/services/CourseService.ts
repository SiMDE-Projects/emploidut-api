import { getCustomRepository } from "typeorm";
import { CourseRepository } from "../repository/CourseRepository";

/**
 * Course service class
*/
export class CourseService {

    private courseRepository: CourseRepository;

    constructor() {
        this.courseRepository = getCustomRepository(CourseRepository);
    }

    /**
     * Get course by id
     * @param id 
     * @returns Course | undefined
     */
    public findOne = async (id: string) => {
        const course = await this.courseRepository.findById(id);
        return course;
    }

    /**
     * 
     * @returns Course[] | undefined
     */
    public findAll = async () => {
        const courses = await this.courseRepository.find();
        return courses;
    }
}
