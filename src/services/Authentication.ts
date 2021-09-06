import { NextFunction, Request, Response } from "express";
import Logger from "./Logger";

var OAuth = require('oauth');
var axios = require('axios');

// Create var for the authentication middleware
const portailURL = process.env.AUTH_PORTAIL_URL;
const redirectURL = process.env.AUTH_REDIRECT_URL;

var oauth2 = new OAuth.OAuth2(
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

// Create a token for the client (emploidut back end)
const createClientToken = async () => {
    // Obtaining access_token for the client
    oauth2.getOAuthAccessToken(
        '',
        {
            'grant_type':'client_credentials',
            'client_id': process.env.AUTH_CLIENT_ID,
            'client_password': process.env.AUTH_CLIENT_PASSWORD,
        },
        async function (err:any, access_token:any, refresh_token:any, results:any) {
            Logger.debug('Client access_token: ' + access_token);
            process.env.CLIENT_TOKEN = JSON.stringify(results);
            return access_token;
        }
    );
}

// Get a token for the client (emploidut back end)
export const getClientToken = async () => {
    // Check if a token exists in the environment variables
    if (process.env.CLIENT_TOKEN === undefined || process.env.CLIENT_TOKEN === null) {
        return await createClientToken();
    } else {
        // Extract token from env
        const token = JSON.parse(process.env.CLIENT_TOKEN);

        // Check token validity
        const responseAxios = await axios({
            method: 'GET',
            url: `${portailURL}/api/v1/client/users`,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'Authorization': 'Bearer ' + token.access_token,
            }
        }).catch((err: any) => {
            return err.response;
        }).then((response: any) => {
            return response;
        });

        if (responseAxios.status === 200) {
            return token.access_token;
        } else {
            return await createClientToken();
        }
    }
}

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
