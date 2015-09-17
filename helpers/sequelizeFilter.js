/**
 * Created by andrzej on 17.09.15.
 */
module.exports = {
    /**
     *
     * @param query
     * @param options
     * @param next
     */
    prepareWhere: function(query, options, next)
    {
        if(options.available){
            this.strainObject(query, options.available,
                function(err, result){
                    var where = {};
                    if(result) {
                        for (var key in result) {
                            where[key] = {
                                $like: '%' + result[key] + '%'
                            }
                        }
                    }
                    next(null, where);
                }
            );
        }
    },
    strainObject: function(query, availableFields, next) {

        for (var key in query) {
            if (availableFields.indexOf(key) === -1) {
                delete query[key];
            }
        }
        next(null, query);
    }
}