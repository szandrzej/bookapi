var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models').User;
var Token = require('../models').Token;


module.exports = {
    init: function(app){

        app.use(passport.initialize());
        app.use('/api', passport.authenticate('bearer', { session: false }),
            function(req, res, next) {
                next();
            }
        );
        passport.use(new BearerStrategy(
                function(token, done) {
                    Token.findOne({
                        attributes: ['id'],
                        where: { accessToken: token },
                        include: [{
                            model: User,
                            as: 'user'
                        }]
                    })
                        .then(function (result) {
                            if(!result) done('something is wrong');
                            else {
                                var token = result;
                                if (!token) {
                                    done(null, false);
                                }
                                done(null, token.user, {scope: 'all'});
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            )
        );
    }
};