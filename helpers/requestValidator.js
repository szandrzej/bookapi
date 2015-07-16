var codes = require('../routes/codes');

var validator = {
    checkRequiredFields: function(data, fieldsArray, callback){
        for(var key in fieldsArray){
            var prop = fieldsArray[key];
            if(data.hasOwnProperty(prop))
                return callback(codes.code400(prop + ' cannot be changed.'));
        }

        callback(null, true);
    }
};

module.exports = validator;