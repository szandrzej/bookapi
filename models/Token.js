"use strict";

var randomString = require('random-string');
var env = process.env.NODE_ENV || "development";
var config = require('../config/conf.json')[env];

module.exports = function(sequelize, DataTypes) {
    var Token = sequelize.define("Token", {
            accessToken:
            {
                type: DataTypes.STRING(60),
                allowNull: false
            },
            expirationDate:
            {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            hooks:{
              beforeValidate: function(entity){
                  if(env !== 'test'){
                      var date = new Date();
                      entity.accessToken = randomString({length: 60});
                      entity.expirationDate = date.getTime() + config.expirationTime * 1000;
                  }
              }
            },
            defaultScope: {
                where: {
                    expirationDate: {
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