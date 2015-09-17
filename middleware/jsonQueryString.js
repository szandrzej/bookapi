/**
 * Created by andrzej on 17.09.15.
 */

var config = require('../config/details.json');

module.exports = function(req, res, next){

    if(req.query === undefined) next();

    var details = {};

    var filter = req.query.filter;
    if(filter){
        details.filter = JSON.parse(filter);
    }

    var order = req.query.order;
    if(order){
        details.order = JSON.parse(order);
    }

    details.limit = req.query.limit || config.limit;

    details.offset = req.query.offset || 0;

    req.details = details;

    next();
};