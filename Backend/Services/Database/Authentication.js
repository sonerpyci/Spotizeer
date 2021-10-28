const models = require('../../Models');
const PasswordModule = require("../../Modules/PasswordModule");
const User = models.User;

module.exports = {
    UTILITY : {
        getTableName: () => {
            return User.tableName;
        },
        ValidateEntry: async (entry) => {
            return await User.ValidateCustom(entry);
        },
        ValidatePassword: (encryptedPassword, input) => {
            let encryptedInput = PasswordModule.scrypt(input);
            return encryptedPassword === encryptedInput;
        },
    },
    DATABASE_ENGINE : {
        CheckUserExists: async (requestBody) => {
            try {
                return (await User.findOne({
                    where: {
                        [models.Sequelize.Op.or]:
                            [
                                requestBody.Id ? {Id: requestBody.Id} : {},
                                requestBody.Email ? {email: requestBody.Email} : {},
                                requestBody.Username ? {username: requestBody.Username} : {},
                                requestBody.Phone ? {Phone: requestBody.Phone} : {},
                            ]
                    }
                }) !== null)
            } catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.CheckUserExists() : ${e}`);
                throw e;
            }


        },
        GetUserByWhere: async (whereOpts, limit=null, offset=null) => {
            try {
                return await User.findOne({whereOpts});
            }
            catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.GetUserByWhere() : ${e}`);
                throw e;
            }

        },
        GetUserForLogin: async (requestBody, includeRelations=false) => {
            try {
                let opts = {
                    where: {
                        [models.Sequelize.Op.or]:
                        [
                            requestBody.Email ? {email: requestBody.Email} : {},
                            requestBody.Username ? {username: requestBody.Username} : {},
                            requestBody.Phone ? {Phone: requestBody.Phone} : {},
                        ]
                    },
                    include: includeRelations ? [
                        {
                            model: models.Role,
                            as: 'Role',
                            required: true,
                        },
                        {
                            model: models.Language,
                            as: 'Language',
                            required: true,
                        }
                    ] : [],
                };
                return await User.findOne({opts});
            }
            catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.GetUserByWhere() : ${e}`);
                throw e;
            }

        },
        CreateUser: async (requestBody) => {
            try {
                return await User.create({
                    FirstName: requestBody.FirstName,
                    MiddleName: requestBody.MiddleName,
                    LastName: requestBody.LastName,
                    Username: requestBody.Username,
                    Password: requestBody.Password,
                    Email: requestBody.Email,
                    Phone: requestBody.Phone,
                    District: requestBody.District,
                    Province: requestBody.Province,
                    Country: requestBody.Country,
                    Status: 1,
                    RoleId: 2, // non-admin user default
                    LanguageId: 1, // "TR" default
                });
            } catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.CreateUser() : ${e}`);
                throw e;
            }
        },
        CreateSessionForUser: async (user, entry) => {
            try {
                return await user.createSession({
                    UserId: entry.UserId,
                    IP: entry.IP,
                    Browser: entry.Browser,
                });
            } catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.CreateSessionForUser() : ${e}`);
                throw e;
            }
        },
        CreateDeezerAccount: async (entry) => {
            try {
                return await models.DeezerAccount.create({
                    DeezerId: entry.DeezerId,
                    UserId: entry.UserId,
                    Name: entry.Name,
                    AccountUrl: entry.AccountUrl,
                    PictureUrl: entry.PictureUrl,
                    TrackListUrl: entry.TrackListUrl,
                    Type: entry.Type,
                    AuthToken: entry.AuthToken,
                });
            } catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.CreateDeezerAccountForUser() : ${e}`);
                throw e;
            }
        },
        CreateSpotifyAccount: async (entry) => {
            try {
                return await models.SpotifyAccount.create({
                    SpotifyId: entry.SpotifyId,
                    UserId: entry.UserId,
                    Name: entry.Name,
                    AccountUrl: entry.AccountUrl,
                    PictureUrl: entry.PictureUrl,
                    TrackListUrl: entry.TrackListUrl,
                    Type: entry.Type,
                    AuthToken: entry.AuthToken,
                    RefreshToken: entry.RefreshToken,
                });
            } catch (e) {
                console.log(`ERR -> Service.Authentication.DATABASE_ENGINE.CreateDeezerAccountForUser() : ${e}`);
                throw e;
            }
        }
    }

};