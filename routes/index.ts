import express from 'express';
import { TimeSlotController } from '../src/controller/TimeSlotController';
import { CourseController } from '../src/controller/CourseController';
import { ExchangeController } from '../src/controller/ExchangeController';
import { UserController } from '../src/controller/UserController';
import { TimetableController } from '../src/controller/TimetableController';

var router = express.Router();

/*********** Route: emploidut ************/

/* GET Emploidutemps. */
router.get('/emploidut', TimetableController.getEmploidut);

/*********** Route: timeslots ************/

/* GET timeslots for one student (login) */
router.get('/timeslots', TimeSlotController.getTimeSlots);
/* POST timeslots for one student (login) */
router.post('/timeslots', TimeSlotController.postTimeSlots);
/* PUT timeslots for one student (login) */
router.put('/timeslots', TimeSlotController.putTimeSlots);

/*********** Route: courses ************/

/* GET courses for one student (login) */
router.get('/courses', CourseController.getCourses);
/* POST courses for one student (login) */
router.post('/courses', CourseController.postCourses);
/* PUT courses for one student (login) */
router.put('/courses', CourseController.putCourses);

/*********** Route: exchanges ************/

/* GET exchange for one student (login) */
router.get('/exchanges', ExchangeController.getExchanges);
/* POST exchange for one student (login) */
router.post('/exchanges', ExchangeController.postExchanges);
/* PUT exchange for one student (login) */
router.put('/exchanges', ExchangeController.putExchanges);

/*********** Route: users ************/

/* GET exchange for one student (login) */
router.get('/users/:id', new UserController().findOne);
/* POST exchange for one student (login) */
//router.post('/users', UserController.postUsers);
/* PUT exchange for one student (login) */
//router.put('/users', UserController.putUsers);

module.exports = router;
