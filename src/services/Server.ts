import express from "express";

require('dotenv').config()
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import { createConnection}  from "typeorm";
import { UserController } from "../controller/UserController";
import { ExchangeController } from "../controller/ExchangeController";
import { CourseController } from "../controller/CourseController";
import { TimeSlotController } from "../controller/TimeSlotController";

export class Server {
    private app: express.Application;
    private userController?: UserController;
    private exchangeController?: ExchangeController;
    private courseController?: CourseController;
    private timeSlotController?: TimeSlotController;


    constructor(){
        this.app = express(); // init the application
        this.configuration();
        this.routes();
    }

    /**
     * Method to configure the server,
     * If we didn't configure the port into the environment
     * variables it takes the default port 3000
     */
    public configuration() {
        this.app.set('port', process.env.PORT || 3000);

        // view engine setup
        this.app.set('views', path.resolve('./', './views'));
        this.app.set('view engine', 'pug');

        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
    }

    private unknownRoutesConfiguration() {
        // catch 404 and forward to error handler
        this.app.use(function(req?: any, res?: any, next?: any) {
            next(createError(404));
        });

        // error handler
        this.app.use(function(err?: any, req?: any, res?: any, next?: any) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            console.log(res.locals.message);
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    /**
     * Method to configure the routes
     */
    public async routes(){
        await createConnection({
            type: "mysql",
            host: process.env.DB_HOSTNAME,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            logging: false,
            entities: [
                process.env.DB_ENTITIES_DIR || ''
            ],
            migrations: [
                process.env.DB_MIGRATIONS_DIR || ''
            ],
            subscribers: [
                process.env.DB_SUSCRIBERS_DIR || ''
            ],
            cli: {
                entitiesDir: process.env.DB_CLI_ENTITIES_DIR || '',
                migrationsDir: process.env.DB_CLI_MIGRATIONS_DIR || '',
                subscribersDir: process.env.DB_CLI_SUSCRIBERS_DIR || ''
            }
        });

        this.userController = new UserController();
        this.exchangeController = new ExchangeController();
        this.courseController = new CourseController();
        this.timeSlotController = new TimeSlotController();

        // Configure routes for each controller
        this.app.use("/api/users", this.userController.router);
        this.app.use("/api/exchanges", this.exchangeController.router);
        this.app.use("/api/courses", this.courseController.router);
        this.app.use("/api/timeslots", this.timeSlotController.router);

        this.unknownRoutesConfiguration();
    }

    /**
     * Used to start the server
     */
    public async start(){
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening ${this.app.get('port')} port.`);
        });
    }

    public async stop(){

    }
}
