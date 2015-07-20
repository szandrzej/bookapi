var codes = require('../routes/codes');

var validator = {
    checkRequiredFields: function(data, fieldsArray, callback){
        var errors = [];
        for( var key in fieldsArray ){
            var prop = fieldsArray[key];
            if(!data.hasOwnProperty(prop))
                errors.push(prop + ' is missing');
        }
        if(errors.length != 0){
            callback({ errors: errors });
        } else{
            callback(null, true);
        }
    }
};

module.exports = validator;