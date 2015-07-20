'use strict';

var express = require('express');
var codes = require('./codes');
var Authors = require('../models').Author;
var router = express.Router();
var Validator = require('../helpers/requestValidator');

var authorCreateFields = ['firstName', 'lastName'];

/* Get all authors */
router.get('/', function(req, res, next) {
    Authors.findAll().then(function(result){
        res.body = {
            authors: result
        };
        res.resCode = 200;
        next();
    });
});

router.post('/', function(req, res, next){
    var data = req.body;
    Validator.checkRequiredFields(data, authorCreateFields, function(err, result){
        console.log(err);
        if(err){
            var error = createError(err, 'error.bad_request', 400);
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
                    var error = createError(err, 'error.author_exists', 409);
                    next(error);
                });

        }
    });
});

/* Get all authors */
router.get('/:id', function(req, res, next) {
    var authorId = req.params.id;
    Authors.find({ where: {id: authorId }})
        .then(function(result){
            res.resCode = 200;
            res.body = result.get();
            next();
        })
        .catch(function(err){
            var error = createError(err, 'error.author_not_found', 404);
            next(error);
        });
});

/* Get all authors */
router.delete('/:id', function(req, res, next) {
    var authorId = req.params.id;
    Authors.destroy({ where: {id: authorId }})
        .then(function(){
            res.resCode = 204;
            next();
        })
        .catch(function(err){
            var error = createError(err, 'error.author_not_found', 404);
            next(error);
        });
});

function createError(err, code, status){
    var error = new Error();
    error.info = err.errors;
    error.desc = code;
    error.resCode = status;
    return error;
}


module.exports = router;
