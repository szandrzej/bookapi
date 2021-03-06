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
            instanceMethods: {
                getLimitedData: function(){
                    return {
                        id: this.id,
                        title: this.title,
                        publishYear: this.publishYear,
                        language: this.language,
                        description: this.description,
                        cover: this.cover,
                    }
                }
            },
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
                    Book.belongsToMany(models.Collection, {
                        through: 'BooksCollections',
                    });
                }
            }
        });

    return Book;
};