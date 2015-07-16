'use strict';

var express = require('express');
var codes = require('./codes');
var Authors = require('../models').Author;
var router = express.Router();

var authorCreateFields = ['firstName', 'lastName', 'nationality', 'birthday'];

router.use(function(req, res, next){
    console.log('Question about authors!');
    next();
});

/* Get all authors */
router.get('/', function(req, res, next) {
    Authors.findAll().then(function(result){
        res.body = result;
        res.statusCode = 200;
        next();
    });
});

router.post('/', function(req, res, next){
    var data = req.body;
    console.log(data);

    res.send(data);
});

/* Get all authors */
router.get('/:id', function(req, res, next) {
    var authorId = req.params.id;
    Authors.find({ where: {id: authorId }})
        .then(function(result){
            if(result){
                res.send(result);
            } else{
                res.send(codes.code404("Author not found"));
            }

        });
});




module.exports = router;
