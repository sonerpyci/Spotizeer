const Axios = require('axios');
const QueryString = require('querystring');
const Service = require('../Services/Database/Authentication');
const SessionService = require('../Services/Database/Session');
const JwtUtil = require('../Utils/JsonWebToken/JWTUtils');
const LanguageUtils = require('../Utils/Language/LangUtils');

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
        //https://connect.deezer.com/oauth/auth.php?app_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&perms=basic_access,email....
        let redirectUri = `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${process.env.DEEZER_APP_REDIRECT_URI}&perms=${process.env.DEEZER_APP_PERMISSIONS}`;
        console.log("redirectUri : ", redirectUri);
        res.redirect(redirectUri);
    },
    ContinueOAuthProcess: (req, res, next) => {

        if(req.query.error_reason) {
            let response = {status: 400, content: {success:false, message:req.query.error_reason.toUpperCase()}};
            res.status(response.status).json(response.content);
        }

        let confirmationCode = req.query.code

        //https://connect.deezer.com/oauth/access_token.php?app_id=YOU_APP_ID&secret=YOU_APP_SECRET&code=THE_CODE_FROM_ABOVE
        let accessTokenUri = `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}&secret=${process.env.DEEZER_APP_SECRET}&code=${confirmationCode}`;

        Axios.get(accessTokenUri)
            .then(response => {
                try {
                    let responseParams = QueryString.parse(response.data);
                    console.log("response.data : ",response.data)
                    if(responseParams && responseParams['access_token']) {
                        let accessToken = responseParams['access_token'];
                        let deezerMeUrl = `https://api.deezer.com/user/me?access_token=${accessToken}`;
                        Axios.get(deezerMeUrl)
                            .then(response => {
                                Service.DATABASE_ENGINE.CreateDeezerAccount({
                                    DeezerId: response.data.id,
                                    UserId: req.user.Id,
                                    Name: response.data.name,
                                    AccountUrl: response.data.link,
                                    PictureUrl: response.data.picture,
                                    TrackListUrl: response.data.tracklist,
                                    Type: response.data.type,
                                    AuthToken: accessToken,
                                }).then(deezerAccount => {
                                    let response = {status: 200, content: {success:true, message:"DEEZER_AUTH_SUCCESSFUL"}};
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