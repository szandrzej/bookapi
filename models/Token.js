"use strict";

module.exports = function(sequelize, DataTypes) {
    var Token = sequelize.define("Token", {
            expireToken:
            {
                type: DataTypes.STRING(60),
                allowNull: false
            },
            refreshToken:
            {
                type: DataTypes.STRING(60),
                allowNull: false
            },
            expireDate:
            {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            defaultScope: {
                where: {
                    expireDate: {
                        $gt: new Date()
                    }
                }
            },
            classMethods: {
                associate: function(models) {
                }
            }
        });

    return Token;
};