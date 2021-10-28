const models = require('../../Models');
const PasswordModule = require("../../Modules/PasswordModule");
const Session = models.Session;

module.exports = {
    UTILITY : {
        getTableName: () => {
            return Session.tableName;
        },
        ValidateEntry: async (entry) => {
            return await Session.ValidateCustom(entry);
        },
    },
    DATABASE_ENGINE : {
        GetSessionById: async (id, includeRelations=false) => {
            try {
                let opts = {
                    include: includeRelations ? [
                        {
                            model: models.User,
                            as: 'User',
                            required: false,
                        }
                    ] : [],
                };
                return await Session.findByPk(id, {opts});
            }
            catch (e) {
                console.log(`ERR -> Service.Session.DATABASE_ENGINE.GetSessionById() : ${e}`);
                throw e;
            }

        },
        CreateSession: async (entry) => {
            try {
                return await Session.create({
                    UserId: entry.UserId,
                    IP: entry.IP,
                    Browser: JSON.stringify(entry.Browser),
                });
            } catch (e) {
                console.log(`ERR -> Service.Session.DATABASE_ENGINE.CreateSession() : ${e}`);
                throw e;
            }
        }
    }

};