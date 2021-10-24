const models = require(".")
module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Route: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'Name',
            validate: {
                notEmpty : {msg: 'Log Route cannot be empty.'}
            }
        },
        Method: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'Name',
            validate: {
                notEmpty : {msg: 'Log Method cannot be empty.'}
            }
        },
        RequestHeaders: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'RequestHeaders',
            validate: {
                notEmpty : {msg: 'Log RequestHeaders cannot be empty.'}
            }
        },
        RequestBody: {
            type: DataTypes.STRING,
            allowNull : true,
            field: 'RequestBody'
        },
        ResponseHeaders: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'ResponseHeaders',
            validate: {
                notEmpty : {msg: 'Log ResponseHeaders cannot be empty.'}
            }
        },
        ResponseBody: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'ResponseBody',
            validate: {
                notEmpty : {msg: 'Log ResponseBody cannot be empty.'}
            }
        },
        ResponseStatus: {
            field: 'ResponseStatus',
            allowNull : false,
            type: DataTypes.INTEGER
        },
        UserId: {
            field: 'UserId',
            type: DataTypes.BIGINT
        },
        SessionId: { // Session logic will be implemented later.
            field: 'SessionId',
            type: DataTypes.BIGINT
        },
        Status: {
            type: DataTypes.INTEGER,
            field: 'Status',
            defaultValue: 1
        }
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        tableName: 'Logs',
    });

    Log.associate = function (models) {
        Log.belongsTo(models.User, {
            foreignKey: 'UserId',
            targetKey: 'Id'
        });
        Log.belongsTo(models.Session, {
            foreignKey: 'SessionId',
            targetKey: 'Id'
        });
    };
    return Log;
}