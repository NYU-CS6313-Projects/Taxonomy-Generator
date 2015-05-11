var vizServices = angular.module('vizServices', ['elasticsearch']);

vizServices.service('client', function (esFactory) {
    return esFactory({
        host: 'http://user:123456@vgc.poly.edu/projects/r2sense',
        apiVersion: '1.4'
    });
});

vizServices.factory('db', function(client) {
    
    self.load = function(search, type, taxonomy){
        wordsCount = 50;
        
        if(type == 'taxonomy'){
            var tx = search;
            search = self.taxonomyToSearch(search);
            var exclude = self.exclude(tx);
        }
        
        if(type == 'detail')
        {
            var exclude = "@.*|_link|" + search ;
            if(taxonomy)
                search = "(" + self.taxonomyToSearch(taxonomy) + ") AND " + search;
            wordsCount = 20;
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
    
    self.bigrams = function(search){
        var index = self.index == "twitter2" ? "twitter_shingle" : "accern_shingles"
        
        console.log(index);
        
        wordsCount = 20;
        var exclude = "@.*|_link|" + search ;
        var include = search + ".*|.*" + search ;
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
                      "include":include,
                    "exclude": exclude,
                      "gnd": {}
                  }
                }
            }
        }
        return client.search({
          index: index,
          type: self.type,
          size: 0,
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
        var exclude = "@.*|.*_link.*|" + self.words.join("|") + "|" + tx.ignore.join("|");
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