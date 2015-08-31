var env = "development";
var nodemailer = require('nodemailer');
var config = require('../config/conf')[env]["email"];

module.exports = {
    init: function(app) {
        var transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.login,
                pass: config.pass
            }
        });
        app.mailer = transporter;
    }
};
