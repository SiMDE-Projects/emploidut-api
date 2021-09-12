import { oauth2 } from "../services/Authentication";
import Logger from "../services/Logger";

const jwt_decode = require('jwt-decode');

/**
 * Initial class for one course
 * @class Course
 */
export class Token {

    private static refresh_token: string = '';
    private static access_token: string = '';
    public static __MAX_RETRIES_ = 3;


    // Create a token for the client (emploidut back end)
    static createToken = () => {
        // Obtaining access_token for the client
        oauth2.getOAuthAccessToken(
            '',
            {
                'grant_type': 'client_credentials',
                'client_id': process.env.AUTH_CLIENT_ID,
                'client_password': process.env.AUTH_CLIENT_PASSWORD,
            },
            (err:any, access_token:any, refresh_token:any, results:any) => {
                if (err !== null) {
                    console.error(err);
                    Logger.error('Error while getting client access_token: ' + err.message);
                    return;
                } else {
                    Logger.debug('Client access_token: ' + access_token);
                    Token.refresh_token = refresh_token;
                    Token.access_token = access_token;
                    return;
                }
            }
        );
    }

    // Get access_token
    static getAccessToken = (): string => {
        if (Token.access_token === '') {
            Token.createToken();
        }

        return Token.access_token;
    }

    // Refresh old access_token
    static refreshToken = () => {
        if (Token.refresh_token === '') {
            Token.createToken();
        }

        oauth2.getOAuthAccessToken(
            '',
            {
                'grant_type': 'refresh_token',
                'refresh_token': Token.refresh_token,
                'client_id': process.env.AUTH_CLIENT_ID,
                'client_password': process.env.AUTH_CLIENT_PASSWORD,
            },
            (err:any, access_token:any, refresh_token:any, results:any) => {
                Logger.debug('Client access_token: ' + access_token);
                Token.access_token = access_token;
                return;
            }
        );
    }

    static isValid = (): boolean => {
        if (Token.access_token === '') {
            Token.createToken();
        }

        // Decode token
        var decoded_token = jwt_decode(Token.access_token);

        // Get today's timestamp
        const now = Math.floor(Date.now() / 1000)
        return decoded_token && decoded_token.exp > now;
    }
}
