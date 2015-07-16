"use strict";

module.exports = function(sequelize, DataTypes) {
    var Author = sequelize.define("Author", {
            firstName:
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
            lastName:
            {
                type: DataTypes.STRING(24),
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 24],
                        msg: "Last name is too short!"
                    }
                }
            },
            birthday:
            {
                type: DataTypes.DATE,
                allowNull: true
            },
            nationality:
            {
                type: DataTypes.STRING,
                allowNull: true
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
                    Author.hasMany(models.Book, { as: 'Books'});
                }
            }
        });
    return Author;
};