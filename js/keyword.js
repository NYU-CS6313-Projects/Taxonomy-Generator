viz.directive("keyword", function($window) {
  return{
    restrict: "EA",
    scope: {
        word: '=',
        topic: '=',
        detail: '='
    },
    link: function(scope, elem, attrs){
        if(!scope.word)
            return;
        
         var width = 80,
            height = 80,
            radius = Math.min(width, height) / 2;
        
        if(scope.detail){
             width = 130;
            height = 130;
            radius = Math.min(width, height) / 2;
            console.log(scope.word);
            console.log(scope.topic);
        }
        
        scope.board = d3.select(elem[0]);
        scope.gliphy = scope.board.append("svg")
            .attr("width", width)
            .attr("height", height)
        
        if(!scope.detail){
            scope.label = scope.board
                .append("h1")
                .attr("title", scope.word.key)
                .text(scope.word.key);
        } 
        
        scope.init = function(){
            scope.createGlyph();
        }
        
        
        var cValue = function(d) { return d.score;},
             color = d3.scale.linear()
                .range(['#de5139','#ede5a4','#769517'])
                .domain([0,0.5,1]);
        
        
        scope.createGlyph = function() {
            var anScore = (scope.word.score * 360);
            
            var scoreArc = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(0 * (Math.PI/180)) 
                .endAngle(-anScore * (Math.PI/180)) 
            
            var scoreArcBase = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(0 * (Math.PI/180)) 
                .endAngle(360 * (Math.PI/180)) 

            scope.gliphy.append("path")
                .attr("class", "scoreArcBase")
                .attr("d", scoreArcBase)
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            scope.gliphy.append("path")
                .attr("class", "scoreArc")
                .attr("d", scoreArc)
                 .style("fill", function(d) { return color(cValue(scope.word));}) 
                
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            

            scope.createVeen();
        }
        
        scope.createVeen = function () {
            var sets = [ 
                {sets: ['word'], size:  scope.word.bg_count}, 
                {sets: ['topic'], size: scope.topic.count},
                {sets: ['word','topic'], size: scope.word.doc_count}];
            
            var chart = venn.VennDiagram() 
                .width(width)
                .height(height)
            var veen = scope.gliphy.append("g")
                .attr("transform", "translate(" + 0 +"," + 0 +")")
                .datum(sets).call(chart)
            scope.gliphy.selectAll(".venn-circle path")
                .style("fill", null);
            
        }
        
        scope.init();
        
    }
  };
});







viz.directive("keyword2", function($window) {
  return{
    restrict: "EA",
    scope: {
        word: '=',
        topic: '=',
        detail: '='
    },
    link: function(scope, elem, attrs){
        if(!scope.word)
            return;
        
         var width = 80,
            height = 80,
            radius = Math.min(width, height) / 2;
        
        if(scope.detail){
             width = 130;
            height = 130;
            radius = Math.min(width, height) / 2;
            console.log(scope.word);
            console.log(scope.topic);
        }
        
        scope.board = d3.select(elem[0]);
        scope.gliphy = scope.board.append("svg")
            .attr("width", width)
            .attr("height", height)
        
        if(!scope.detail){
            scope.label = scope.board
                .append("h1")
                .attr("title", scope.word.key)
                .text(scope.word.key);
        } 
        
        scope.init = function(){
            scope.createGlyph();
        }
        
        
        var cValue = function(d) { return d.score;},
             color = d3.scale.linear()
                .range(['#de5139','#ede5a4','#769517'])
                .domain([0,0.5,1]);
        
        
        scope.createGlyph = function() {
            var anScore = (scope.word.score * 360);
            
            var scoreArc = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(0 * (Math.PI/180)) 
                .endAngle(-anScore * (Math.PI/180)) 
            
            var scoreArcBase = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(0 * (Math.PI/180)) 
                .endAngle(360 * (Math.PI/180)) 

            scope.gliphy.append("path")
                .attr("class", "scoreArcBase")
                .attr("d", scoreArcBase)
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            scope.gliphy.append("path")
                .attr("class", "scoreArc")
                .attr("d", scoreArc)
                 .style("fill", function(d) { return color(cValue(scope.word));}) 
                
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            

            scope.createVeen();
        }
        
        scope.createVeen = function () {
            var sets = [ 
                {sets: ['word'], size:  scope.word.bg_count}, 
                {sets: ['topic'], size: scope.topic.count},
                {sets: ['word','topic'], size: scope.word.doc_count}];
            
            var chart = venn.VennDiagram() 
                .width(width)
                .height(height)
            var veen = scope.gliphy.append("g")
                .attr("transform", "translate(" + 0 +"," + 0 +")")
                .datum(sets).call(chart)
            scope.gliphy.selectAll(".venn-circle path")
                .style("fill", null);
            
        }
        
        scope.init();
        
    }
  };
});



















