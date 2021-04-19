var qs = require('querystring');
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('../../routes/index');
var app = express();
const port = process.env.PORT || 3000;

import { oauth2, authURL } from '../services/Authentication';

export class Server {

    constructor() {}

    async start() {
        
        // view engine setup
        app.set('views', path.resolve('./', './views'));
        app.set('view engine', 'pug');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        //app.use(express.static(path.join(__dirname, './../public')));

        app.all('*', function (req?: any, res?: any, next?: any) {
            /**
             * Check if the user is connected
             */
            if (req.query.code === null || req.query.code === undefined) {
                // Handle redirection (the user is not connected th oauth2 yet)
                return res.redirect(authURL);
            } else {
                /** Obtaining access_token */
                oauth2.getOAuthAccessToken(
                req.query.code,
                {
                    'redirect_uri': 'http://localhost:3000/',
                    'grant_type':'authorization_code'
                },
                function (e, access_token, refresh_token, results){
                    if (e) {
                        console.log(e);
                        res.end(e);
                    } else if (results.error) {
                        console.log(results);
                        res.end(JSON.stringify(results));
                    }
                    else {
                        console.log('Obtained access_token: ', access_token);
                        res.end( access_token);
                    }
                });
            }

            // Send the request to next server's middlware
            next();
        });

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
