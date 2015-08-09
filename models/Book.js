"use strict";

module.exports = function(sequelize, DataTypes) {
    var Book = sequelize.define("Book", {
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
            },
            publishYear:
            {
                type: DataTypes.INTEGER(4),
                allowNull: true,
                validate: {
                    min: 1000,
                    max: 2100
                }
            },
            language:
            {
                type: DataTypes.STRING(3),
                allowNull: true,
                validate: {
                    isIn: ['pl', 'eng', 'ger', 'esp', 'fr']
                }
            },
            cover:
            {
                type: DataTypes.STRING,
                allowNull: true
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
                    Book.belongsTo(models.User, {
                       foreignKey: 'creatorId',
                        as: 'creator'
                    });
                    Book.belongsTo(models.Author, {
                        foreignKey: 'authorId',
                        constraints: true,
                        as: 'author'
                    });
                    Book.belongsTo(models.Location, {
                        foreignKey: 'locationId',
                        as: 'location'
                    });
                    Book.belongsTo(models.Collection, {
                        foreignKey: 'collectionId',
                        constraints: true,
                        as: 'collection'
                    });
                }
            }
        });

    return Book;
};