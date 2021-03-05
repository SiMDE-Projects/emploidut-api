import express from 'express';
var router = express.Router();

import { TimeSlotController } from '../src/controller/TimeSlotController';
import { CourseController } from '../src/controller/CourseController';
import { ExchangeController } from '../src/controller/ExchangeController';


/**********************************************************************
******************************* GET **********************************
**********************************************************************/

/* GET home page. */
router.get('/', function(req?: any, res?: any, next?: any) {
  res.render('index', { title: 'Express' });
});

/* GET Emploidutemps. */
router.get('/emploiDuTemps', function(req?: any, res?: any, next?: any) {
  res.render('index', { title: `Emploid'ut` });
});

/* GET timeSlots for one student (login) */
router.get('/timeSlots', TimeSlotController.getTimeSlots)

/* GET courses for one student (login) */
router.get('/courses', CourseController.getCourses)

/* GET exchange for one student (login) */
router.get('/exchanges', ExchangeController.getExchanges)

/**********************************************************************
******************************* POST **********************************
**********************************************************************/

/* POST timeSlots for one student (login) */
router.post('/timeSlots', TimeSlotController.postTimeSlots)

/* POST courses for one student (login) */
router.post('/courses', CourseController.postCourses)

/* POST exchange for one student (login) */
router.post('/exchanges', ExchangeController.postExchanges)

/**********************************************************************
******************************* PUT ***********************************
**********************************************************************/

/* PUT timeSlots for one student (login) */
router.put('/timeSlots', TimeSlotController.putTimeSlots)

/* PUT courses for one student (login) */
router.put('/courses', CourseController.putCourses)

/* PUT exchange for one student (login) */
router.put('/exchanges', ExchangeController.putExchanges)

module.exports = router;
