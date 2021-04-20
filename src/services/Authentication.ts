var OAuth = require('oauth');

/**
 * Create var for the authentication middleware
*/

var oauth2 = new OAuth.OAuth2(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET,
    'http://localhost:8000/',
    'oauth/authorize',
    'oauth/token',
    null
); 

var authURL = oauth2.getAuthorizeUrl({
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/', // TODO: Add the real rediction
    scope: ['user-get-info user-get-assos user-get-roles'],
    state: ''
});

export const authenticationFilter = function (req?: any, res?: any, next?: any) {

    /**
     * Check if the request contains a valid token
     */
    const token = req.header('authorization');
    if (token !== null && token !== undefined && token !== '') {
        // TODO: Check if the token is valid. If not, redirect to cas
        // if (!isValid()) {
        //     return res.redirect(authURL);
        // }

        // Send the request to next server's middlware
        next();
        return;
    }

    /**
     * Check if the user is connected
     */
    if (req.query.code === null || req.query.code === undefined || req.query.code === '') {
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
                res.end(access_token);
            }
        });
    }

    // Send the request to next server's middlware
    next();
};
