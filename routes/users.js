var express = require('express');
var async = require('async');
var router = express.Router();
var Validator = require('../helpers/requestValidator');
var Error = require('../helpers/errorCreator');
var Users = require('../models').User;
var Tokens = require('../models').Token;
var SequelizeValidationError = require('sequelize').ValidationError;
var SequelizeUniqueContraintError = require('sequelize').UniqueConstraintError;

/* GET users listing. */
router.post('/register', function(req, res, next) {
    async.waterfall([
        function(next){
            Validator.checkRequiredFields(req.body, ['email', 'username', 'password'], next);
        },
        function(result, next){
            Users.create(result)
                .then(function(user){
                    next();
                })
                .catch(function(error){
                    next(error);
                });
        }
    ], function(err, result){
        //console.log(err);
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
            var error = Error.createError(err, 'error.user_not_exists', 404);
            next(error);
            return;
        });
});

router.post('/login', function(req, res, next){
    async.waterfall([
        function(next){
            Validator.checkRequiredFields(req.body, ['email', 'password'], next);
        },
        function(result, next){
            Users.scope('login').find({where: {email: result.email}})
                .then(function(user){
                    next(null, user, result);
                }).catch(function(err){
                    var error = Error.createError(err, 'error.user_not_found', 404);
                    next(error);
                });
        },
        function(user, result, next){
            user.verifyPassword(result.password, function(err, correct){
                if(err){
                    console.log(err);
                    var error = Error.createError(err, 'error.bad_request', 400);
                    next(error);
                    return;
                } else{
                    if(correct){
                        next(null, user);
                    } else{
                        var error = Error.createError({}, 'error.bad_credentials', 401);
                        next(error);
                        return;
                    }
                }
            });
        },
        function(user, next){
          if(!user.activated){
              var error = Error.createError(err, 'error.not_activated', 401);
              next(error);
              return;
          } else{
            next(null, user);
          }
        },
        function(user, next){
            Tokens.create({}).then(function(token){
                token.setUser(user).then(function(token){
                    var result = {
                        accessToken: token.accessToken,
                        refreshToken: user.refreshToken,
                        user: user.getLimitedData()
                    };
                    next(null, result);
                });
            })
        }
    ], function(err, result){
        if(err){
            if(err.errors){
                next(Error.createError(err.errors, 'error.bad_request', 400));
            } else{
                next(err);
            }
        } else{
            res.body = result;
            res.resCode = 200;
            next();
        }
    });
});

module.exports = router;
