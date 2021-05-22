import {Connection, createConnection} from "typeorm";
import express from "express";
import {UserController} from "../controller/UserController";
require('dotenv').config()
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const port = process.env.PORT || 3000;

export class Server {
    private
    private app: express.Application;
    private userController?: UserController;

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
        this.app.set('port', process.env.PORT || 3001);
        this.app.use(express.json());
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

        this.app.use(`/api/users`,this.userController.router); // Configure the new routes of the controller post
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
