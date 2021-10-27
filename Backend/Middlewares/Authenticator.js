const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtModule = require('./../Modules/JwtModule');

const passportUtils = require('./../Utils/Passport/passportUtils');

module.exports = {
    initialize: () => {
        passport.use(passportUtils.getStrategy(passportUtils.getOptions()));
        return passport.initialize();
    },
    authenticate: function (req, res, next) {
        let token = jwtModule.ExtractJwtFromRequest(req) || null;
        //let minutesUntilExpiration = null;
        let payload = null;

        return passport.authenticate("jwt", {
            session: false
        }, (err, user, info) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (!user) {
                //onlineUserListHelper.dropSocketViaToken(token);
                return res.status(401).json({
                    status: 'Error',
                    error: 'Authentication Required.'
                });
            }
            try {
                if (token) {
                    payload = jwt.verify(token, process.env.JWT_ENCRYPTION);
                    //minutesUntilExpiration = onlineUserListHelper.checkExpirationTimeOfJwt(payload.exp);
                    //if (minutesUntilExpiration && minutesUntilExpiration < 15) {
                    //    onlineUserListHelper.informClientAgainstExpiration(token, minutesUntilExpiration)
                    //}
                }
            } catch (e) {
                console.log(e)
            }
            //console.log("allowUsersToLogin === false && (user.role !== 1 ||  user.role !== 3) : ", allowUsersToLogin === false && (user.role !== 1 ||  user.role !== 3))
            /*if (allowUsersToLogin === false && (user.role !== 1 ||  user.role !== 3)) {
                return res.status(503).json({
                    success: false,
                    message: lang.info_messages["002"][user.preferredLanguage]
                });
            }*/
            console.log("req.user : ", user)
            req.user = user;
            next();
        })(req, res, next);
    }
};