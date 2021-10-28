const Axios = require('axios');
const QueryString = require('querystring');
const HttpHelper = require('../Helpers/HttpHelper');
const Service = require('../Services/Database/Authentication');
const PasswordModule = require('../Modules/PasswordModule');
const SessionService = require('../Services/Database/Session');
const JwtUtil = require('../Utils/JsonWebToken/JWTUtils');
const LanguageUtils = require('../Utils/Language/LangUtils');
const Querystring = require("querystring");

const cookieConfig = {
    httpOnly: true
    /*expires: 6000,
    sameSite: true,
    signed: true,
    secure: true*/
};

module.exports = {
    getTableName: () => {
        return Service.UTILITY.getTableName()
    },
    /*Signup: (req, res, next) => {
        Service.UTILITY.ValidateEntry(req.body)
        .then((isValid) => {
            if (isValid) {
                Service.DATABASE_ENGINE.CheckUserExists(req.body)
                .then((ifUserExists) => {
                    if (ifUserExists) {
                        let response = {status: 400, content: {success:false, message:"ERR_USER_ALREADY_EXISTS"}};
                        res.status(response.status).json(response.content);
                    }  else {
                        Service.DATABASE_ENGINE.CreateUser(req.body)
                        .then((user) => {
                            let response = {status: 201, content: {success:true, user:user}};
                            res.status(response.status).json(response.content);
                        }).catch((err) => {
                            let response = {status: 500, content: {success:false, message:err.message}};
                            res.status(response.status).json(response.content);
                        })
                    }
                }).catch((err) => {
                    let response = {status: 400, content: {success:false, message:err.message}};
                    return res.status(response.status).json(response.content)
                })
            } else {
                let response = {status: 400, content: {success:false, message:"ERR_USER_INVALID_INPUT"}};
                res.status(response.status).json(response.content);
            }
        }).catch((err) => {
            let response = {status: 500, content: {success:false, message:err.message}};
            return res.status(response.status).json(response.content)
        })
    },*/
    StartOAuthProcess: (req, res, next) => {
        let state = PasswordModule.GeneratePassword(16, true, true, false);
        //https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${process.env.SPOTIFY_APP_CONTINUE_URI}&client_id=${process.env.SPOTIFY_APP_ID}&state=${state}&scope=${process.env.SPOTIFY_APP_PERMISSIONS}
        let redirectUri = 'https://accounts.spotify.com/authorize?' +
            Querystring.stringify({
                response_type: 'code',
                client_id: process.env.SPOTIFY_APP_ID,
                scope: process.env.SPOTIFY_APP_PERMISSIONS,
                redirect_uri: process.env.SPOTIFY_APP_CONTINUE_URI,
                state: state
            });

        console.log("redirectUri : ", redirectUri);
        res.redirect(redirectUri);
    },
    ContinueOAuthProcess: (req, res, next) => {
        if(req.query.error) {
            let response = {status: 400, content: {success:false, message:req.query.error.toUpperCase()}};
            res.status(response.status).json(response.content);
        }
        let confirmationCode = req.query.code
        let state = req.query.state
        //https://accounts.spotify.com/api/token
        let accessTokenUri = `https://accounts.spotify.com/api/token`;

        Axios.post(accessTokenUri, HttpHelper.Serialize({
                code: confirmationCode,
                redirect_uri: process.env.SPOTIFY_APP_CONTINUE_URI,
                grant_type: 'authorization_code'
            }),
        {
            headers: {
                'Authorization': `Basic ${(new Buffer.from(process.env.SPOTIFY_APP_ID + ':' + process.env.SPOTIFY_APP_SECRET)).toString('base64')}`,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }).then(response => {
            try {
                console.log("response.data : ",response.data)
                if(response.data && response.data['access_token']) {
                    let accessToken = response.data['access_token'];
                    let refreshToken = response.data['refresh_token'];
                    let spotifyMeUrl = `https://api.spotify.com/v1/me`;
                    Axios.get(spotifyMeUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type':'application/json'
                        },
                        json:true
                    }).then(response => {
                            Service.DATABASE_ENGINE.CreateSpotifyAccount({
                                SpotifyId: response.data.id,
                                UserId: req.user.Id,
                                Name: response.data.display_name,
                                AccountUrl: response.data.href,
                                PictureUrl: response.data.images[0].url,
                                TrackListUrl: response.data.tracklist,
                                Type: response.data.type,
                                AuthToken: accessToken,
                                RefreshToken: refreshToken,
                            }).then(spotifyAccount => {
                                let response = {status: 200, content: {success:true, message:"SPOTIFY_AUTH_SUCCESSFUL"}};
                                res.status(response.status).json(response.content);
                            }).catch(err => {
                                let response = {status: 500, content: {success:false, message:err.message}};
                                res.status(response.status).json(response.content);
                            });
                        })
                        .catch(err => {
                            let response = {status: 500, content: {success:false, message:err.message}};
                            res.status(response.status).json(response.content);
                    });
                } else {
                    let response = {status: 400, content: {success:false, message:"ACCESS_TOKEN_FAILURE"}};
                    res.status(response.status).json(response.content);
                }
            } catch (err) {
                let response = {status: 500, content: {success:false, message:err.message}};
                res.status(response.status).json(response.content);
            }
        })
        .catch(err => {
            let response = {status: 500, content: {success:false, message:err.message}};
            res.status(response.status).json(response.content);
        });
    }
};