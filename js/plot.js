viz.directive("plot", function($window) {
  return{
    restrict: "EA",
    scope: {
        data: '='
    },
    link: function(scope, elem, attrs){
        
        if(!scope.data)
            return;
        
         var width = 600,
             height = 600,
             radius = Math.min(width, height) / 2;
        
        scope.board = d3.select(elem[0]);
        
        scope.init = function(){
            scope.svg =  scope.board.append("svg")
                .attr("height",height)
                .attr("width",width);
            
            scope.sScore = d3.scale.linear().range([40,width/2-40]);
            scope.sAngle = d3.scale.linear().range([0,360 * (Math.PI/180)])
            scope.sSize = d3.scale.linear().range([10,100])
            
        }
        
        scope.update = function (data){
            if(data.length > 0) {
                scope.sAngle.domain([0, data.length]);
                scope.sScore.domain([d3.min(data, function(d){return d.score}), d3.max(data, function(d){return d.score})]);
                scope.sSize.domain([d3.min(data, function(d){return d.doc_count}), d3.max(data, function(d){return d.doc_count})]);
                
                console.log(scope.sSize.domain());
                
                var dist = 120;
                var radius = width/2;
                console.log(scope.sAngle(0));
                scope.svg
                    .append("circle")
                    .attr("r",10)
                    .attr("cx",(width/2))
                    .attr("cy",width/2)
                    .attr("class", "topic")
                dataManip = scope.svg.selectAll(".keywords")
                    .data(data, function(d) { return d.key});
                dataManip
                    .enter()
                    .append("circle")
                    .attr("class", "keywords")
                    .attr("r",0)
                    .attr("cx",function(d,i) { return radius + scope.sScore(d.score) * Math.sin(scope.sAngle(i))})
                    .attr("cy",function(d,i) { return radius + scope.sScore(d.score)  * Math.cos(scope.sAngle(i))});
                dataManip
                    .exit().remove()
                
                scope.svg.selectAll(".keywords")
                    .transition()
                    .attr("r",function(d){return scope.sSize(Math.sqrt((d.doc_count)/Math.PI))})
                    .attr("cx",function(d,i) { return radius + scope.sScore(d.score) * Math.sin(scope.sAngle(i))})
                    .attr("cy",function(d,i) { return radius + scope.sScore(d.score)  * Math.cos(scope.sAngle(i))});
            }
        }
        
        //-----------------------------------------
       
        scope.init();
        scope.$watch(function(scope) { return scope.data }, function (newValue, oldValue){
            scope.update(newValue);
        });
    }
  };
});



















