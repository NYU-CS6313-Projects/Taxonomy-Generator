var vizServices = angular.module('vizServices', ['elasticsearch']);

vizServices.service('client', function (esFactory) {
    return esFactory({
        host: 'http://vgc.poly.edu/projects/r2sense/',
        apiVersion: '1.4'
    });
});

vizServices.factory('db', function(client) {
    var self = this;
    var client = client;
    
    self.load = function(any, not, hide, and){

        var index = 'twitter2';

        var type = 'status';
        
        var querystring = "(";
        var exclude = "@.*|_link";
        
        any.forEach(function(w){
            querystring += '"'+w.word +'" ';
            exclude += "|"+ w.word;
        })
        
        querystring += ")";
        if(and.length > 0){
        querystring += "  AND (";
        and.forEach(function(w){
            querystring += '"'+w.word +'" ';
            exclude += "|"+ w.word;
        })
        querystring += ") ";
        }
        
        not.forEach(function(w){
            querystring += "-'" + w.word + "' ";
            exclude += "|"+ w.word ;
        });
        if(hide)
            hide.forEach(function(w){
                exclude += "|"+ w.word ;
            });
        
        
        var query = {
            "query": {
                "query_string": {
                      "default_field": "text",
                      "query": "text: " + querystring
                    }
                }, 
            "highlight": {"fields": {"text": {}}}, 
            "aggs": {
                "NAME": {
                  "significant_terms": {
                    "field": "text",
                    "size": 50,
                    "exclude": exclude,
                      "gnd": {}
                  }
                }
            }
        }
        
        return client.search({
          index: index,
          type: type,
          size: 50,
          body: query
        });
    }
    return self;
    
});