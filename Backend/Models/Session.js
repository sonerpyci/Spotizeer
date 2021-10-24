const models = require(".")
module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
        Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            field: 'UserId',
            type: DataTypes.BIGINT
        },
        IP: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'IP',
            validate:{
                isIP: {msg: 'Session Invalid Ip'}
            }
        },
        Browser: {
            type: DataTypes.TEXT,
            allowNull : false,
            field: 'Browser',
            validate: {
                notEmpty : {msg: 'Session Browser cannot be empty.'}
            }
        },
        Status: {
            type: DataTypes.INTEGER,
            field: 'Status',
            defaultValue: 1
        }
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        tableName: 'Sessions',
    });

    Session.associate = function (models) {
        Session.belongsTo(models.User, {
            foreignKey: 'UserId',
            targetKey: 'Id'
        });
        Session.hasMany(models.Log, {
            foreignKey: 'SessionId',
        });
    };
    return Session;
}