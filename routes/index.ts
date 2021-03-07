import express from 'express';
var router = express.Router();

import { TimeSlotController } from '../src/controller/TimeSlotController';
import { CourseController } from '../src/controller/CourseController';
import { ExchangeController } from '../src/controller/ExchangeController';

/* GET home page. */
router.get('/', function(req?: any, res?: any, next?: any) {
  res.render('index', { title: 'Express' });
});

/*********** Route: emploidut ************/

/* GET Emploidutemps. */
router.get('/emploidut', function(req?: any, res?: any, next?: any) {
  res.render('index', { title: `Emploid'ut` });
});

/*********** Route: timeslots ************/

/* GET timeslots for one student (login) */
router.get('/timeslots', TimeSlotController.getTimeSlots)

/* POST timeslots for one student (login) */
router.post('/timeslots', TimeSlotController.postTimeSlots)

/* PUT timeslots for one student (login) */
router.put('/timeslots', TimeSlotController.putTimeSlots)

/*********** Route: courses ************/

/* GET courses for one student (login) */
router.get('/courses', CourseController.getCourses)
/* POST courses for one student (login) */
router.post('/courses', CourseController.postCourses)
/* PUT courses for one student (login) */
router.put('/courses', CourseController.putCourses)

/*********** Route: exchanges ************/

/* GET exchange for one student (login) */
router.get('/exchanges', ExchangeController.getExchanges)

/* POST exchange for one student (login) */
router.post('/exchanges', ExchangeController.postExchanges)

/* PUT exchange for one student (login) */
router.put('/exchanges', ExchangeController.putExchanges)

module.exports = router;
