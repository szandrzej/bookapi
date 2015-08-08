var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var authorsRoute = require('./routes/authors');
var passport = require('passport');
var config = require('./config/authConfig');

var app = express();

config.authInitialization();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/api', passport.authenticate('bearer', { session: false }),
    function(req, res, next) {
        next();
    }
);

app.use('/', routes);
app.use('/auth', users);
app.use('/api/authors', authorsRoute);

app.use(function(req, res){
    var finalData = {
        status: res.resCode,
        code: 'success',
        extras: res.body
    };
    res.status(res.resCode);
    res.send(finalData);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    var finalData = {
        status: err.resCode,
        code: err.desc,
        errors: err.info
    };
    res.status(err.resCode);
    res.send(finalData);
});
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send();
});



module.exports = app;
