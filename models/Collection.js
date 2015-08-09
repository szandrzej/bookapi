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
                    Collection.hasMany(models.Book, {
                        foreignKey: 'collectionId',
                        constraints: true,
                        as: 'books'
                    });
                    Collection.belongsToMany(models.User, {
                        as: 'users',
                        through: 'UsersCollections',
                        foreignKey: 'collectionId'
                    });
                    Collection.belongsTo(models.User, {
                        foreignKey: 'creatorId',
                        as: 'creator'
                    });
                }
            }
        });

    return Collection;
};