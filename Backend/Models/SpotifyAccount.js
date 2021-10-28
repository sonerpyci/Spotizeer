const models = require(".")
module.exports = (sequelize, DataTypes) => {
    const SpotifyAccount = sequelize.define('SpotifyAccount', {
        Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        SpotifyId: {
            type: DataTypes.BIGINT,
            field: 'SpotifyId',
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
                notEmpty : {msg: 'SpotifyAccount Name cannot be empty.'}
            }
        },
        AccountUrl: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'AccountUrl',
            validate: {
                notEmpty : {msg: 'SpotifyAccount AccountUrl cannot be empty.'}
            }
        },
        PictureUrl: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'PictureUrl',
            validate: {
                notEmpty : {msg: 'SpotifyAccount PictureUrl cannot be empty.'}
            }
        },
        TrackListUrl: {
            type: DataTypes.TEXT,
            allowNull : true,
            field: 'TrackListUrl',
        },
        Type:  {
            type: DataTypes.STRING,
            allowNull : true,
            defaultValue: 'user',
            field: 'Type',
        },
        AuthToken: {
            type: DataTypes.TEXT,
            allowNull : false,
            field: 'AuthToken',
            validate: {
                notEmpty : {msg: 'SpotifyAccount AuthToken cannot be empty.'}
            }
        },
        RefreshToken: {
            type: DataTypes.TEXT,
            allowNull : false,
            field: 'RefreshToken',
            validate: {
                notEmpty : {msg: 'SpotifyAccount RefreshToken cannot be empty.'}
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
        tableName: 'SpotifyAccounts',
    });

    SpotifyAccount.associate = function (models) {
        SpotifyAccount.belongsTo(models.User, {
            foreignKey: 'UserId',
            targetKey: 'Id'
        });
    };
    return SpotifyAccount;
}