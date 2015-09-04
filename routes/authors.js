'use strict';

var express     = require('express');
var router      = express.Router();
var async       = require('async');

var Authors     = require('../models').Author;

var Validator   = require('../helpers/requestValidator');
var Error       = require('../helpers/errorCreator');

var authorCreateFields = ['firstName', 'lastName'];

/* Get all authors */
router.get('?search=:slug&limit=:limit&last=:lastId', getAllAuthors);
router.post('', createAuthor);
router.get('/:id', getOneAuthor);
router.put('/:id', editAuthor);
router.delete('/:id', deleteAuthor);
router.get('/:id/books', getBooksFromAuthor);

function getAllAuthors(req, res, next){
    var slug = req.params.slug;
    var limit = req.params.limit ? req.params.limit : 10;
    var last = req.params.lastId ? req.params.lastId : 0;

    Authors.findAll()
        .then(function(result){
            res.body = {
                authors: result
            };
            res.resCode = 200;
            next();
        });
}

function createAuthor(req, res, next){
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
                    res.body = author.get();
                    next();
                })
                .catch(function(err){
                    var error = Error.createError(err, 'error.author_exists', 409);
                    next(error);
                });
        }
    });
}

function getOneAuthor(req, res, next){
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
            res.body = result.get();
            next();
        }
    });
}

function editAuthor(req, res, next){
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
            res.body = result.get();
            res.resCode = 200;
            next();
        }
    });
}

function deleteAuthor(req, res, next){
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
                author: author
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
