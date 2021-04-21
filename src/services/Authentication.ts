import { response } from "express";

var OAuth = require('oauth');
var axios = require('axios');
/**
 * Create var for the authentication middleware
*/

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
    scope: ['user-get-info user-get-assos user-get-roles'],
    state: ''
});

export const authenticationFilter = async function (req:any, res:any, next:any) {
    /**
     * Check if the request contains a valid token
     */
    const token = req.header('authorization');
    if (token !== null && token !== undefined && token !== '') {
        // Check if the token is valid (use routes)
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

        if ( responseAxios.status !== 200) {
            return res.redirect(authURL);
        }

        // Send the request to next server's middlware
        next();
        return;
    }

    /**
     * Check if the request has query parameters named code
     */
    const authorizationCode = req.query.code;

    if (authorizationCode === null || authorizationCode === undefined || authorizationCode === '') {
        // Handle redirection (the user is not connected with oauth2 yet)
        return res.redirect(authURL);
    } else {
        /** Obtaining access_token */
        oauth2.getOAuthAccessToken(
            authorizationCode,
            {
                'redirect_uri': redirectURL,
                'grant_type':'authorization_code'
            },
            function (err:any, access_token:any, refresh_token:any, results:any){
                if (err) {
                    console.log(err);
                    res.end(err);
                    return;
                } else if (results.error) {
                    console.log(results);
                    res.end(JSON.stringify(results));
                }
                else {
                    console.log('Obtained access_token: ', access_token);
                    res.end(access_token);

                    // Get information from the connected user
                    // Need to be admin to perform the request
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
                        console.log(response.data);
                    }).catch(function (err:any) {
                        console.error(err);
                    });
                }
            }
        );
    }

    // Send the request to next server's middlware
    next();
};