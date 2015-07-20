var codes = {
    code400: function(info){
        var error = {
            code: 400,
            description: 'error.request_validation',
            errors: {
                error: info
            }
        };
        return error;
    },

    code401: function(noToken){
        var error = {
            code: 401,
            description: 'error.auth_token_invalid',
            extras: {}
        };
        if (noToken) {
            error.description = 'error.no_token';
        }
        return error;
    },

    code403: function(){
        var error = {
            code: 403,
            description: 'error.unauthorized',
            extras: {}
        };
        return error;
    },

    code404: function(){
        var error = {
            code: 404,
            description: 'error.not_found',
            extras: {}
        };
        return error;
    },

    code409: function(info){
        var error = {
            code: 409,
            description: 'error.conflict',
            extras: {
                info: info
            }
        };
        return error;
    },

    code500: function(){
        var error = {
            code: 500,
            description: 'error.somethings_gone_wrong',
            extras: {}
        };
        return error;
    },

    code503: function(){
        var error = {
            code: 503,
            description: 'error.db_connection_failed',
            extras: {}
        };
        return error;
    },

    code200: function(desc, extra){
        var success = {
            code: 200,
            description: desc,
            extras: extra
        };
        return success;
    },

    code201: function(desc, extra){
        var success = {
            code: 201,
            description: desc,
            extras: extra
        };
        return success;
    },

    code204: function(){
        return { code: 204 };
    }
};

module.exports = codes;