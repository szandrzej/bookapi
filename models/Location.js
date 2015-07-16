"use strict";

module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define("Location", {
            name:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 60],
                        msg: "Name is too short!"
                    }
                }
            },
            description:
            {
                type: DataTypes.STRING(256),
                allowNull: true
            }
        },
        {
            classMethods: {
                associate: function(models) {
                    Location.hasMany(models.Book, {as: 'Books'});
                }
            }
        });

    return Location;
};