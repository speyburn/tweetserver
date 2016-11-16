import express from 'express';

const config = require('./config');
import { getBearerToken, getUserWall, respondFromCache, addCorsHeaders } from './middleware'
import { notify } from './utils';

const twitterApiUrl = 'https://api.twitter.com';
const tokenUrl = twitterApiUrl + '/oauth2/token';

const urlParameters = config.url_parameters || [];
const parameterString = urlParameters.join('&');
const timelineUrl = `${twitterApiUrl}/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name=${config.screen_name}&${parameterString}`;

const concated = config.twitter.consumer_key + ':' + config.twitter.consumer_secret;
const credentials = new Buffer(concated).toString('base64');

let app = express();
let port = process.env.PORT || 8080;

let getConfig = (req, res, next) => {
    let settings = {
        config,
        tokenUrl,
        timelineUrl,
        credentials
    };

    Object.assign(req, settings);
    next();
}

app.get('/', getConfig, addCorsHeaders, respondFromCache, getBearerToken, getUserWall);
app.listen(port);
notify(`Server started and listening to port *:${port}`);
