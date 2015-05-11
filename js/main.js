var primary = "#489BD5";
var Secondary = "#B3D548"; 
var detailStatus = "hidden";
var viz = angular.module('viz', ['vizServices', 'ngSanitize']);
var detailHeight = 150;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var scope = angular.element(ev.target).scope();
    ev.dataTransfer.setData("word", scope.word.key);
}
function drag_child(ev) {
    var scope = angular.element(ev.target).scope();
    ev.dataTransfer.setData("word", scope.wordChild.key);
}



function dropIg(evt){
    evt.preventDefault();
    evt.stopPropagation();
  
    var data = evt.dataTransfer.getData("word");
    var scope = angular.element(document.getElementsByTagName("body")).scope();
    var has = false;
    scope.taxonomy.ignore.forEach(function(d){
        if(d == data)
            has = true;
    })
    if(!has){
        scope.$apply(function () {
            scope.taxonomy.ignore.push(data);
        });
    }
    for(i=0; i< evt.path.length; i++)
    {
        var el = evt.path[i];
        if(el.className && el.className.indexOf && el.className.indexOf('dropzone') >=0){
            el.style.backgroundColor = "";
            break;
        }
    }
}

function drop1(ev) {
    //console.log(ev)
    
    ev.preventDefault();
    ev.stopPropagation();
    for(i=0; i< ev.path.length; i++)
    {
        var el = ev.path[i];
        if(el.className && el.className.indexOf && el.className.indexOf('dropzone') >=0){
            el.style.backgroundColor = "";
            var data = ev.dataTransfer.getData("word");
            var scope = angular.element(el).scope();
            
            var idx = scope.node.value.findIndex(function(e) { return e.word == data });
            if(idx >= 0)
                return;
            scope.$apply(function () {
                scope.node.value.push({ word: data});
            });
            break;
        }
    }
    
}

function resize(show, big){
    var fullH = window.innerHeight;
    var top = fullH - (show ? detailHeight : 10000)+5;
   
    d3.select("#suggestions").style({'bottom': (show ? detailHeight : 0) + 'px'});
    
    setTimeout(function() {
     d3.select("#details").style({'top': top + 'px'});
    },1);
}

document.addEventListener("dragenter", function( evt ) {
    for(i=0; i< evt.path.length; i++)
    {
        var el = evt.path[i];
        if(el.className && el.className.indexOf && el.className.indexOf('dropzone') >=0){
            el.style.backgroundColor = "#dee5ca";
            break;
        }
    }
}, false);

document.addEventListener("dragleave", function( evt ) {
    for(i=0; i< evt.path.length; i++)
    {
        var el = evt.path[i];
        if(el.className && el.className.indexOf && el.className.indexOf('dropzone') >=0){
            el.style.backgroundColor = "";
            break;
        }
    }
}, false);

viz.controller('vizCtrl', function ($scope, db) {
    //Defaults ------------------------------------------------------
    $scope.sortKeywords = 'score';
    $scope.showStart = true;
    $scope.taxonomy = {
        type: "topic",
        value: "Contains",
        text: [],
        childs: [],
        ignore: []
    }
    $scope.baseTaxonomy = [];
    $scope.inTaxonomy = [];
    $scope.Loading = false;
    $scope.indices = [
            {desc:"Twitter", index: "twitter2", field:"text", type: "status"},
            {desc:"Twitter with bigrams", index: "twitter_shingle", field:"text", type: "status"}
    ];
    $scope.index = $scope.indices[0];
    
    $scope.srchType = 'taxonomy';
    
    //UI
    $scope.txHigh = function(node){
        node.highlight = true;
        console.log('high');
    }
    
    
    
    //Actions ------------------------------------------------------
    $scope.start = function(){
        if($scope.topic && $scope.topic.length > 4) {
            $scope.taxonomy.text.push({ word: $scope.topic });
            $scope.showStart = false;
            $scope.load();
            $scope.updateBaseTaxonomy($scope.taxonomy);
        }
        else {
            alert('The topic has to have more then 4 letters');
        }
    }
    
    //Word Actions
    $scope.toggle = function(w){
        w.off = !w.off;
    }
    $scope.remove = function (w, list){
        var idx = list.findIndex(function(e) { return e.word == w.word });
        list.splice(idx, 1);
    }
    
    //KeyWord
    $scope.unselectWord = function(){
        $scope.selected = undefined;
        resize($scope.selected, $scope.showMoreDetails);
    }
    
    $scope.selectWord = function(keyword){
        
        $scope.selected = [keyword];
        db.load(keyword.key, "detail", $scope.taxonomy).then(function(result){
            keyword.details = { 
                doc_count: result.aggregations.NAME.doc_count,
                documents: result.hits.hits,
                keywords: result.aggregations.NAME.buckets,
                topicData: { count:  result.aggregations.NAME.doc_count}
            }
        });
        setTimeout(function () { resize($scope.selectWord, $scope.showMoreDetails) }, 10);
    }
    
    $scope.showMoreDetails = function(){
        var keyword = $scope.selected[0];
        db.load(keyword.key, "detail").then(function(result){
            keyword.detailsGlobal = { 
                doc_count: result.aggregations.NAME.doc_count,
                documents: result.hits.hits,
                keywords: result.aggregations.NAME.buckets,
                topicData: { count:  result.aggregations.NAME.doc_count}
            }
        });
        db.bigrams(keyword.key).then(function(result){
            keyword.bigrmas = result.aggregations.NAME.buckets;
            keyword.maxBigram = d3.max(keyword.bigrmas, function(d) {return d.bg_count});
            console.log(keyword.maxBigram);
        });
        $scope.moreDetails = true;
    }
    
    $scope.removeIgnore = function(ig){
        var idx = $scope.taxonomy.ignore.indexOf(ig);
        if(idx >= 0){
            $scope.taxonomy.ignore.splice(idx, 1);
        }
    }
    
    //Server
    $scope.load = function(){
        db.index = $scope.index.index;
        db.type = $scope.index.type;
        $scope.Loading = true;
        var searchPar = $scope.taxonomy;
        if($scope.srchType == "search"){
            console.log($scope.searchText);
            searchPar = $scope.searchText;
        }
            
        db.load(searchPar, $scope.srchType).then(function(result){
            $scope.doc_count = result.aggregations.NAME.doc_count;
            $scope.documents = result.hits.hits;
            $scope.keywords = result.aggregations.NAME.buckets;
            $scope.topicData = { count:  $scope.doc_count};
            $scope.Loading = false;
        });   
    }
    
    
    var w = angular.element(window);
    w.bind('resize', function () {
        resize($scope.selected, $scope.showMoreDetails);
    });
    
    //Utils
    $scope.updateBaseTaxonomy = function(){
        $scope.baseTaxonomy = [];
        $scope.getBaseNode($scope.taxonomy);
    }
    $scope.getBaseNode = function(node, parent, nextSibling){
        node.idx = $scope.baseTaxonomy.length;
        
        if(node.type == "topic")
            node.noRemove = true;
        
        node.no = function(type){
            idx = node.childs.findIndex(function(r){ return r.value == type });
            if(idx >= 0)
                return true;
        }
        
        node.add = function(type){
            node.childs.push({type: 'rule', value: type, childs: [], text: []});
            $scope.updateBaseTaxonomy();
        }
        
        node.addWord = function(){
            var word = prompt("Type the new keyword")
            
            node.text.push({word: word});
            $scope.updateBaseTaxonomy();
            console.log(node);
        }
        
        node.remove = function(){
            console.log(parent);
            console.log(node);
            var idx = parent.childs.findIndex(function(r){return r.value == node.value })
            if(idx >= 0){
                parent.childs.splice(idx, 1);
                $scope.updateBaseTaxonomy();
            }
        }
        
        
        $scope.baseTaxonomy.push(node);
        if(parent){
            node.level = parent.level+1;
            node.marks = parent.marks.slice(0);
            if(nextSibling){
                node.marks.push('parent_sibling');
            } else {
                node.marks.push('parent');
            }
        } else {
            node.level = 1;
            node.marks = [];
        }
        
        
        if(node.text)
            $scope.getBaseNode({value: node.text, type: 'value', childs: []},node, node.childs[0]); 
        
        
        if(node.childs){
            for(j=0; j < node.childs.length; j++){
                rule = node.childs[j];
                rule.type = 'rule';
                
                var k = j+1;
                var t = j;
                $scope.getBaseNode(rule, node, node.childs[k]);       
                j = t;
            }   
        }
        return node;
    }
    
    //Temp
    //$scope.topic = "violence";
    //$scope.start();
})


//Utils
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

viz.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});











