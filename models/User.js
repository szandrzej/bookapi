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
            salt:
            {
                type: DataTypes.STRING,
                allowNull: false
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
            hooks: {
                beforeValidate: function (user) {
                    var plainPwd = user.password;
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(plainPwd, salt);

                    user.salt = salt;
                    user.password = hash;

                    if(user.role === undefined){
                        user.role = 'user';
                    }
                },
                beforeCreate: function(user){
                    user.refreshToken = randomString({length: 120});
                    user.activationCode = randomString({length: 30});
                }
            },
            getterMethods: {
                fullName: function()  {
                    return this.firstName + ' ' + this.lastName
                }
            },
            classMethods: {
                associate: function(models) {
                    User.belongsToMany(models.Collection, {
                        as: 'Collections',
                        through: 'UsersCollections'
                    });
                    User.hasMany(models.Token, { as: 'ActiveTokens'});
                }
            }
        });

    return User;
};