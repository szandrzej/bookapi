/**
 * Created by andrzej on 17.09.15.
 */
module.exports = {
  preparePagination: function(root, details, next){
      var pagination = {};
      if(details.offset >= details.limit){
          var diff = +details.offset - +details.limit;
          pagination.previous = root + '?'
              + 'offset=' + diff
              + '&limit=' + details.limit;
          if(details.filter){
              pagination.previous += '&filter=' + JSON.stringify(details.filter);
          }
          if(details.order){
              pagination.previous += '&order=' + JSON.stringify(details.order);
          }
      } else {
          var diff = +details.offset + +details.limit;
          pagination.previous = null;
          pagination.next = root + '?'
              + 'offset=' + diff
              + '&limit=' + details.limit;
          if(details.filter){
              pagination.next += '&filter=' + JSON.stringify(details.filter);
          }
          if(details.order){
              pagination.next += '&order=' + JSON.stringify(details.order);
          }
      }
      next(null, pagination)
  }
};