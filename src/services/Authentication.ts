import { NextFunction, Request, Response } from "express";
import { Token } from "../entity/Token";
import Logger from "./Logger";

var OAuth = require('oauth');
var axios = require('axios');

// Create var for the authentication middleware
const portailURL = process.env.AUTH_PORTAIL_URL;
const redirectURL = process.env.AUTH_REDIRECT_URL;

export var oauth2 = new OAuth.OAuth2(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET,
    `${portailURL}/`,
    'oauth/authorize',
    'oauth/token',
    null
); 

var authURL = oauth2.getAuthorizeUrl({
    response_type: 'code',
    redirect_uri: redirectURL, // TODO: Add the real rediction
    scope: ['user-get-info user-get-roles'],
    state: ''
});

export const authenticationFilter = async function (req: Request, res: Response, next: NextFunction) {
    // Check if the request contains a valid token
    let token = req.header('authorization');
    if (token !== null && token !== undefined && token !== '') {
        // Chek if we receive a Bearer token
        if (!token.startsWith("Bearer")){
            token =  'Bearer ' + token;
        }

        // Check if the token is valid (used route: user's information)
        const responseAxios = await axios({
            method: 'GET',
            url: `${portailURL}/api/v1/user`,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'Authorization': token
            }
        }).catch((err: any) => {
            return err.response;
        }).then((response: any) => {
            return response;
        });

        if (responseAxios.status !== 200) {
            return res.redirect(authURL);
        }

        // Send the request to next server's middlware
        next();
        return;
    }

    // Check if the request has query parameters named code
    const authorizationCode = req.query.code;

    if (authorizationCode === null || authorizationCode === undefined || authorizationCode === '') {
        // Handle redirection (the user is not connected with oauth2 yet)
        return res.redirect(authURL);
    } else {
        // Obtaining access_token
        oauth2.getOAuthAccessToken(
            authorizationCode,
            {
                'redirect_uri': redirectURL,
                'grant_type':'authorization_code'
            },
            async function (err:any, access_token:any, refresh_token:any, results:any) {
                if (err) {
                    Logger.error(err);
                    return res.status(500).send('Internal Server Error');
                } else if (results.error) {
                    Logger.error(results);
                    return res.status(500).send('Internal Server Error');
                }
                else {
                    Logger.debug(`Obtained access_token:  ${access_token}`);

                    // Get information from the connected user
                    axios({
                        method: 'GET',
                        url: `${portailURL}/api/v1/user`,
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Charset': 'utf-8',
                            'Authorization': 'Bearer ' + access_token
                        }
                    }).then(function (response:any) {
                        // Print user information
                        Logger.debug(response.data);
                        next();
                    }).catch(function (err:any) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    });
                }
            }
        );
    }
};
