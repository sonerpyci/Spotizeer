const models = require('../../Models');
const PasswordModule = require("../../Modules/PasswordModule");
const Log = models.Log;

module.exports = {
    UTILITY : {
        getTableName: () => {
            return Log.tableName;
        },
        ValidateEntry: async (entry) => {
            return await Log.ValidateCustom(entry);
        },
    },
    DATABASE_ENGINE : {
        GetLogsForBackOffice: async (opts, includeRelations=false) => {
            try {
                let opts = {
                    where: {
                        [models.Sequelize.Op.and]:
                        [
                            opts.UserId ? {UserId: opts.UserId} : {},
                            opts.SessionId ? {username: requestBody.SessionId} : {},
                        ]
                    },
                    include: includeRelations ? [
                        {
                            model: models.User,
                            as: 'User',
                            required: false,
                        },
                        {
                            model: models.Session,
                            as: 'Session',
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
        CreateLog: async (logEntry) => {
            try {
                return await Log.create({
                    Route: logEntry.Route,
                    Method: logEntry.Method,
                    RequestHeaders: logEntry.RequestHeaders,
                    RequestBody: logEntry.RequestBody,
                    ResponseBody: logEntry.ResponseBody,
                    ResponseHeaders: logEntry.ResponseHeaders,
                    ResponseStatus: logEntry.ResponseStatus,
                    UserId: logEntry.UserId,
                    SessionId: logEntry.SessionId,
                });
            } catch (e) {
                console.log(`ERR -> Service.Logger.DATABASE_ENGINE.CreateLog() : ${e}`);
                throw e;
            }
        }
    }
};