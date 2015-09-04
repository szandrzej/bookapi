var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var auth = require('./routes/auth');
var authorsRoute = require('./routes/authors');
var collectionsRoute = require('./routes/collections');
var passport = require('passport');
var authConfig = require('./config/auth');
var mailerConfig = require('./config/mailer');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors({
        origin: 'http://client.bookapi.dev',
        methods: 'GET,PUT,POST,DELETE, OPTIONS',
        credentials: true
    }
));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

authConfig.init(app);
mailerConfig.init(app);

app.use('/', routes);
app.use('/auth', auth);
app.use('/api/authors', authorsRoute);
app.use('/api/collections', collectionsRoute);

app.use(function(req, res){
    if(res.body) {
        res.body.pagination = {
            _self: req.path
        };
    }
    var finalData = {
        status: res.resCode,
        code: 'success',
        extras: res.body,
    };
    res.status(res.resCode);
    if(res.satellizer){
        finalData.token = res.token;
    }
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
