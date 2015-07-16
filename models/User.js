"use strict";

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
            }
        },
        {
            getterMethods   : {
                fullName       : function()  {
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