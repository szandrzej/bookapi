'use strict';

var express     = require('express');
var router      = express.Router();
var async       = require('async');
var jsonQuery   = require('../middleware/jsonQueryString');
var filter      = require('../helpers/sequelizeFilter');
var hateoas     = require('../helpers/hateoasHelper');

var Books     = require('../models').Book;

var Validator   = require('../helpers/requestValidator');
var Error       = require('../helpers/errorCreator');

var authorCreateFields = ['firstName', 'lastName'];

/* Get all authors */
router.get('', [jsonQuery, getAllBooks]);
router.post('', createBook);
router.get('/:id', getBook);
router.put('/:id', editBook);
router.delete('/:id', deleteBook);


function getAllBooks(req, res, next){

    async.waterfall([
            function(next){
                filter.prepareWhere(req.details.filter, {available: ['title', 'description', 'cover']}, next);
            },
            function(where, next){
                hateoas.preparePagination('/api/books', req.details, function(err, pagination){
                    next(null, where, pagination);
                });
            },
            function(where, pagination, next){
                Books.findAll({
                    where: where,
                    limit: req.details.limit,
                    offset: req.details.offset
                }).then(function(result){
                    async.map(result, function(book, callback){
                        book = book.get();
                        book._self = '/api/books/' + book.id;
                        callback(null, book);
                    }, function(err, result){
                        next(null, pagination, result);
                    })
                })
            }
        ],
        function(err, pagination, books){
            if(err){
                next(err);
            }
            else{
                if(books.length < req.details.limit){
                    pagination.next = null;
                }

                res.body = {
                    books: books,
                    pagination: pagination
                };
                res.resCode = 200;
                next();
            }
        }
    );
};

function createBook(req, res, next){
    var data = req.body;
    Validator.checkRequiredFields(data, authorCreateFields, function(err, result){
        if(err){
            var error = Error.createError(err, 'error.bad_request', 400);
            next(error);
        }
        if(result){
            Authors.create(data)
                .then(function(author){
                    res.resCode = 201;
                    res.body = {
                        author: author.get(),
                        pagination: {}
                    };
                    next();
                })
                .catch(function(err){
                    var error = Error.createError(err, 'error.author_exists', 409);
                    next(error);
                });
        }
    });
}

function getBook(req, res, next){
    async.waterfall([
        function (next) {
            getAuthorId(req.params, next);
        },
        findAuthor
    ], function (err, result) {
        if (err) {
            next(err)
        } else {
            res.resCode = 200;
            res.body = {
                author: result.get(),
                pagination: {}
            };
            next();
        }
    });
}

function editBook(req, res, next){
    async.waterfall([
        function(next){
            var user = req.user;
            if(user.isAdmin()){
                next();
            } else{
                next(Error.createError({}, 'error.no_permission', 403));
            }
        },
        function (next) {
            getAuthorId(req.params, next);
        },
        function(id, next){
            Authors.find({ where: {id: id }})
                .then(function(result){
                    next(null, result);
                })
                .catch(function(err){
                    var error = Error.createError(err, 'error.author_not_found', 404);
                    next(error);
                });
        },
        function(author, next){
            author.updateAttributes(req.body)
                .then(function(result){
                    next(null, result);
                }).catch(function(err){
                    var error = Error.createError(err, 'error.cannot_update', 400);
                    next(error);
                });
        }
    ], function(err, result){
        if(err){
            next(err);
        } else{
            res.body = {
                author: result.get(),
                pagination: {}
            };
            res.resCode = 200;
            next();
        }
    });
}

function deleteBook(req, res, next){
    async.waterfall([
        function(next){
            var user = req.user;
            if(user.isAdmin()){
                next();
            } else{
                next(Error.createError({}, 'error.no_permission', 403));
            }
        },
        function (next) {
            getAuthorId(req.params, next);
        },
        function(id, next){
            Authors.destroy({ where: {id: id }})
                .then(function(){
                    res.resCode = 204;
                    next();
                })
                .catch(function(err){
                    var error = Error.createError(err, 'error.author_not_found', 404);
                    next(error);
                });
        }
    ], function(err, result){
        if(err){
            next(err);
        } else{
            res.resCode = 204;
            next();
        }
    });
}

function getBooksFromAuthor(req, res, next){
    async.waterfall([
        function (next) {
            getAuthorId(req.params, next);
        },
        function(id, next){
            Authors.find({ where: {id: id }})
                .then(function(result){
                    next(null, result);
                })
                .catch(function(err){
                    var error = Error.createError(err, 'error.author_not_found', 404);
                    next(error);
                });
        },
        function(author, next){
            author.getBooks({raw: true})
                .then(function(bookArray){
                    next(null, bookArray, author);
                });
        },
        function(books, author, next){
            async.map(books,
                function(book, callback){
                    book._self = '/api/books/' + book.id;
                    callback(null, book);
                },
                function(err, books){
                    if(err){
                        next(err);
                    } else{
                        next(null, books)
                    }
                });
        }
    ], function(err, result, author){
        if(err){
            next(err);
        } else{
            res.body = {
                books: result,
                author: author,
                pagination: {}
            };
            res.resCode = 200;
            next();
        }
    });
}

function getAuthorId(params, next){
    var authorId = params.id;
    if(authorId){
        next(null, authorId);
    } else{
        next(Error.createError({}, 'error.no_id', 400));
    }
}

function findAuthor(id, next){
    Authors.find({ where: {id: id }})
        .then(function(result){
            if(result === null) next(Error.createError({}, 'error.author_not_found', 404));
            next(null, result);
        });
}



module.exports = router;
