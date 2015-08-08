var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models').User;
var Token = require('../models').Token;


module.exports = {
    authInitialization: function(){
        passport.use(new BearerStrategy(
                function(token, done) {
                    Token.findOne({
                        attributes: ['id', 'UserId'],
                        where: { accessToken: token },
                        include: [ User ]
                    })
                        .then(function (result) {
                            if(!result) done('something is wrong');
                            else {
                                var token = result.get({plain: true});
                                if (!token) {
                                    done(null, false);
                                }
                                done(null, token.User, {scope: 'all'});
                            }
                        }
                    )
                }
            )
        );
    }
};