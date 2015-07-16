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
            year:
            {
                type: DataTypes.INTEGER(4),
                allowNull: false,
                validate: {
                    min: 1000,
                    max: 2100
                }
            },
            language:
            {
                type: DataTypes.STRING(3),
                allowNull: false,
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
                    Book.belongsTo(models.Author, { as: 'Author'});
                    Book.belongsTo(models.Location, { as: 'Location'});
                    Book.belongsTo(models.Collection), { as: 'Collection'};
                }
            }
        });

    return Book;
};