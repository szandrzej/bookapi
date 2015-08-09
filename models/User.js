"use strict";

var bcrypt = require('bcrypt');
var randomString = require('random-string');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
            username:
            {
                type: DataTypes.STRING(24),
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 24],
                        msg: "First name is too short!"
                    }
                }
            },
            email:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        args: true,
                        msg: "It's not email address"
                    }
                }
            },
            password:
            {
                type: DataTypes.STRING,
                allowNull: false
            },
            activated:
            {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            activationCode:
            {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            refreshToken:
            {
                type: DataTypes.STRING(120),
                allowNull: true
            },
            role:{
                type: DataTypes.ENUM('admin', 'user'),
                allowNull: false
            }
        },
        {
            defaultScope: {
                attributes: ['id', 'username', 'email', 'role']
            },
            scopes: {
                activation: {
                    attributes: ['id', 'email', 'activationCode', 'activated']
                },
                login: {
                    attributes: ['id', 'email', 'password', 'activated', 'refreshToken', 'username']
                }
            },
            hooks: {
                beforeValidate: function (user) {
                    if(user.password){
                        var plainPwd = user.password;
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(plainPwd, salt);

                        user.password = hash;

                        if(user.role === undefined){
                            user.role = 'user';
                        }
                    }
                },
                beforeCreate: function(user){
                    user.refreshToken = randomString({length: 120});
                    if(user.activationCode === undefined){
                        user.activationCode = randomString({length: 30});
                    }
                }
            },
            instanceMethods: {
                verifyPassword: function(password, callback){
                    bcrypt.compare(password, this.password, callback);
                },
                getLimitedData: function(){
                    return {
                        id: this.id,
                        email: this.email,
                        username: this.username
                    }
                },
                isAdmin: function(){
                    return this.role === 'admin';
                }
            },
            classMethods: {
                associate: function(models) {
                    User.belongsToMany(models.Collection, {
                        as: 'Collections',
                        through: 'UsersCollections'
                    });
                    User.hasMany(models.Token, {
                        foreignKey: 'UserId',
                        as: 'user'
                    });
                    User.hasMany(models.Collection, {
                        foreignKey: 'creatorId',
                        as: 'creator'
                    });
                    User.hasMany(models.Book, {
                        foreignKey: 'creatorId',
                        as: 'creator'
                    });
                }
            }
        });

    return User;
};