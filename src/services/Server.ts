require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('../../routes/index');
var usersRouter = require('../../routes/users');
var app = express();
const port = process.env.PORT || 3000;

export class Server {

    constructor() {}

    async start() {
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());

        app.use('/', indexRouter);

        // catch 404 and forward to error handler
        app.use(function(req?: any, res?: any, next?: any) {
            next(createError(404));
        });

        // error handler
        app.use(function(err?: any, req?: any, res?: any, next?: any) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            console.log(res.locals.message);
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        // Start the app
        app.listen(port, () => {
            console.log(`Start listening at http://localhost:${port}`)
        })
    }

    async stop() {}
}
