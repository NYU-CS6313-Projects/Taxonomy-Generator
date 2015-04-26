var viz = angular.module('viz', ['vizServices','ngSanitize','common.dragdrop']);

viz.controller('vizCtrl', function ($scope, db, DragDropHandler) {

    $scope.topic = "climate change";

    $scope.taxonomy = {
        any: [
            {word: "climate", on: true}, 
            {word: "global", on: true}
        ],
        and: [
            {word: "change", on: true}
        ],
        not: [
            {word: "warming", on: true}
        ],
        ignore: [
            {word: "change"}
        ],
        turnoff:[]
    };

   
    $scope.keywords = [];
    
    //Taxonomy operators
    $scope.addKeyword = function(list){
        var word = prompt("Type keyword");
        list.push({word: word, on:true});
        $scope.load();
    }
    
    $scope.add = function(list, value){
        list.push(value);
        $scope.load();
    }

    $scope.removeKeyword = function(word,List) { 
      for (var list in $scope.taxonomy) {
        if ($scope.taxonomy[list]==List) {
          $scope.taxonomy[list] = _.reject($scope.taxonomy[list], function(w) {
            return w == word; 
          });
        }
      }
    };

    //drag-drop-sort
    $scope.moveObject = function(from, to, fromList, toList) {
        var item = $scope.taxonomy[fromList][from];
        DragDropHandler.addObject(item, $scope.taxonomy[toList], to);
        $scope.taxonomy[fromList].splice(from, 1);

    }

    $scope.createObject = function(object, to, list) {
        var newItem = angular.copy(object);
        newItem.id = Math.ceil(Math.random() * 1000);
        DragDropHandler.addObject(newItem, $scope.taxonomy[list], to);
    };
    
    $scope.showDetail = function(word){
        $scope.selected = word;
        $scope.showDialog = true;

    }
  
    // Data operators
     $scope.load = function(){
         document.getElementById("loading").style.display = "block";
        db.load($scope.taxonomy.any, $scope.taxonomy.not, $scope.taxonomy.ignore, $scope.taxonomy.and).then(function(r){
            
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

            document.getElementById("loading").style.display = "none";
        });
    }
    $scope.load();
    
});
