const models = require(".")
module.exports = (sequelize, DataTypes) => {
    const DeezerAccount = sequelize.define('DeezerAccount', {
        Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        DeezerId: {
            type: DataTypes.BIGINT,
            field: 'DeezerId',
            allowNull : false,
        },
        UserId: {
            field: 'UserId',
            type: DataTypes.BIGINT
        },
        Name: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'Name',
            validate: {
                notEmpty : {msg: 'DeezerAccount Name cannot be empty.'}
            }
        },
        AccountUrl: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'AccountUrl',
            validate: {
                notEmpty : {msg: 'DeezerAccount AccountUrl cannot be empty.'}
            }
        },
        PictureUrl: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'PictureUrl',
            validate: {
                notEmpty : {msg: 'DeezerAccount PictureUrl cannot be empty.'}
            }
        },
        TrackListUrl: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'TrackListUrl',
            validate: {
                notEmpty : {msg: 'DeezerAccount TrackListUrl cannot be empty.'}
            }
        },
        Type:  {
            type: DataTypes.STRING,
            allowNull : true,
            defaultValue: 'user',
            field: 'Type',
        },
        AuthToken: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'AuthToken',
            validate: {
                notEmpty : {msg: 'DeezerAccount AuthToken cannot be empty.'}
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
        tableName: 'DeezerAccounts',
    });

    DeezerAccount.associate = function (models) {
        DeezerAccount.belongsTo(models.User, {
            foreignKey: 'UserId',
            targetKey: 'Id'
        });
    };
    return DeezerAccount;
}