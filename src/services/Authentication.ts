var OAuth = require('oauth');

/**
 * Create var for the authentication middleware
*/

export var oauth2 = new OAuth.OAuth2(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET,
    'http://localhost:8000/',
    'oauth/authorize',
    'oauth/token',
    null
); 

export var authURL = oauth2.getAuthorizeUrl({
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/', // TODO: Add the real rediction
    scope: ['user-get-info user-get-assos user-get-roles'],
    state: ''
});
