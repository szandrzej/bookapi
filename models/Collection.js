"use strict";

module.exports = function(sequelize, DataTypes) {
    var Collection = sequelize.define("Collection", {
            title:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 60],
                        msg: "Title is too short!"
                    }
                }
            }
        },
        {
            classMethods: {
                associate: function(models) {
                    Collection.belongsToMany(models.User, {
                        as: 'Users',
                        through: 'UsersCollections',
                        foreignKey: 'collectionId'
                    });
                    Collection.hasMany(models.Book, {
                        as: 'Books'
                    });
                }
            }
        });

    return Collection;
};