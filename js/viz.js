var viz = angular.module('viz', ['vizServices','ngSanitize']);

viz.controller('vizCtrl', function ($scope, db) {
    $scope.topic = "climate change";
    $scope.taxonomy = {
        any: ["climate change"],
        and: [],
        not: [],
        ignore: []
    }
    
    $scope.keywords = [];
    
    //Taxonomy operators
    $scope.addKeyword = function(list){
        var word = prompt("Type keyword");
        list.push(word);
        $scope.load();
    }
    
    $scope.removeKeyword = function(word, list){
        list.remove(word);
    }
    
    //Data operators
    $scope.load = function(){
        db.load($scope.taxonomy.any, $scope.taxonomy.not, $scope.taxonomy.ignore).then(function(r){
            $scope.keywords = r.aggregations.NAME.buckets;
            $scope.tweets = r.hits.hits;
                    
            $scope.totals = {
                "max_doc_count": -Infinity,
                "max_score": -Infinity,
                "min_score": Infinity,
                "max_bg_count": -Infinity,
                "total": r.aggregations.NAME.doc_count
            }
            $scope.keywords.forEach(function(t){
                if(t.doc_count > $scope.totals.max_doc_count)
                    $scope.totals.max_doc_count = t.doc_count;
                
                if(t.score > $scope.totals.max_score)
                    $scope.totals.max_score = t.score;
                
                if(t.score < $scope.totals.max_score)
                    $scope.totals.min_score = t.score;
                
                if(t.bg_count > $scope.totals.max_bg_count)
                    $scope.totals.max_bg_count = (t.bg_count);
            })
            console.log($scope.totals);
            document.getElementById("loading").style.display = "none";
        });
    }
    $scope.load();
    
});