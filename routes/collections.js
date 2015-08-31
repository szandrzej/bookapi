var express = require('express');
var async = require('async');
var router = express.Router();
var Validator = require('../helpers/requestValidator');
var Error = require('../helpers/errorCreator');
var Collections = require('../models').Collection;
var SequelizeValidationError = require('sequelize').ValidationError;
var SequelizeUniqueContraintError = require('sequelize').UniqueConstraintError;

router.get('/', function(req, res, next) {
    var user = req.user;
    async.waterfall([
        function(result, next) {
            try {
                user.getCollections()
                    .success(function (collections) {
                        next(null, collections);
                    });
            }catch(err){
                console.log(err);
            }
        },
        function(collections, next) {
            next(null,collections.get());
        }
    ], function(err, result){
        if(err){
            if(err instanceof SequelizeUniqueContraintError){
                var error = Error.createError(err, 'error.email_already_used', 409);
                next(error);
                return;
            }
            if(err instanceof SequelizeValidationError || err.errors){
                var error = Error.createError(err, 'error.bad_request', 400);
                next(error);
                return;
            }

        } else{
            res.resCode = 201;
            next();
        }
    });
});

router.get('/activate/:id/:code', function(req, res, next){
    var userId = req.params.id;
    var code = req.params.code;

    Users.scope('activation').find({where: {id: userId}})
        .then(function(userObj){
            var user = userObj;
            if(user.activated){
                var error = Error.createError({}, 'error.already_activated', 400);
                next(error);
            } else{
                if(user.activationCode !== code){
                    console.log('Here1');
                    var error = Error.createError({}, 'error.activation_code_not_valid', 400);
                    next(error);
                } else{
                    user.updateAttributes(
                        {activated: true},
                        {fields: ['activated']})
                        .then(function(){
                            res.resCode = 200;
                            next();
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                }
            }
        })
        .catch(function(err){
            console.log(err);
            var error = Error.createError(err, 'error.user_not_exists', 404);
            next(error);
            return;
        });
});

module.exports = router;
