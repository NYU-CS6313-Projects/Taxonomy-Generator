var vizServices = angular.module('vizServices', ['elasticsearch']);

vizServices.service('client', function (esFactory) {
    return esFactory({
        host: 'http://es_admin:klapaucios@localhost:9200',
        apiVersion: '1.4'
    });
});

vizServices.factory('db', function(client) {
    
    self.load = function(search, type){
        wordsCount = 50;
        
        if(type == 'taxonomy'){
            var tx = search;
            search = self.taxonomyToSearch(search);
            var exclude = self.exclude(tx);
        }
        
        if(type == 'detail')
        {
             var exclude = "@.*|_link|" + search ;
            wordsCount = 5;
        }
        
        var query = {
            "fields": ["text"], 
            "query": {
                "query_string": {
                      "default_field": "text",
                      "query": "text: " + search
                    }
                }, 
            "highlight": {"fields": {"text": {}}}, 
            "aggs": {
                "NAME": {
                  "significant_terms": {
                    "field": "text",
                    "size": wordsCount,
                    "exclude": exclude,
                      "gnd": {}
                  }
                }
            }
        }
        return client.search({
          index: self.index,
          type: self.type,
          size: 50,
          body: query
        });
    }
    
    self.words = [];
    
    self.taxonomyToSearch = function(tx){        
        var search = "";
        self.words = [];
        
        search += self.nodeToSearch(tx);
        
        return search;
    }
    
    self.exclude = function(tx){
        var exclude = "@.*|_link|" + self.words.join("|") + "|" + tx.ignore.join("|");
        return exclude;
    }
    
    self.nodeToSearch = function(node){
        var result = "(";
        node.text.forEach(function(w){
            if(!w.off){
                self.words.push(w.word);
                result += "\"" + w.word + "\" ";
            }
        });
        result = result.trim() + ")";
        if(node.childs.length > 0){
            node.childs.forEach(function (r){
                result += " " + r.value + " ";
                result += "(" + self.nodeToSearch(r) + ")";
            })
        }
        
        
        return result;
    }
    
    return self;
    
});