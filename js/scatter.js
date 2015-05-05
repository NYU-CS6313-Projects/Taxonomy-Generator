viz.directive("scatter", function($window) {
  return{
    restrict: "EA",
    scope: {
        data: '='
    },
    link: function(scope, elem, attrs){
        scope.board = d3.select(elem[0]);
        var margin = {top: 10, right: 20, bottom:20, left: 40},
            width = 740, height = 100,
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom;
        
        // setup x 
        var xValue = function(d) { return d.bg_count;}, // data -> value
            xScale = d3.scale.linear().range([0, innerWidth]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickSize(-innerHeight, 0, 0)
                    

        // setup y
        var yValue = function(d) { return d.doc_count ;}, // data -> value
            yScale = d3.scale.linear().range([innerHeight, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(-innerWidth, 0, 0)
                    
                    .ticks(4);
        
        var cValue = function(d) { return d.score;},
             color = d3.scale.linear()
                .range(['#de5139','#ede5a4','#769517'])
                .domain([0,0.5,1]);
        
        var svg = scope.board.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var gxAxis = svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + innerHeight + ")")
                      .call(xAxis);
        gxAxis.append("text")
                  .attr("class", "label")
                  .attr("x", innerWidth)
                  .attr("y", -6)
                  .style({"text-anchor": "end", "font-size":"10px"})
                  .text("Background");
        
         var gyAxis = svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);
              gyAxis.append("text")
                  .attr("class", "label")
                  .attr("transform", "rotate(-90)")
                  .attr("y", -40)
                  .attr("dy", ".75em")
                  .style("text-anchor", "end")
                  .text("Topic");
        
        scope.$watch(function(){return scope.data}, function(newData){
            if(!scope.data)
                return;
            
                
              xScale.domain([d3.min(scope.data, xValue), d3.max(scope.data, xValue)]);
              yScale.domain([d3.min(scope.data, yValue), d3.max(scope.data, yValue)]);
            
                svg.style({"font-size":"10px"})

              // x-axis
              gxAxis.call(xAxis);
              gyAxis.call(yAxis);
              // y-axis
              
            
            
            var dots = svg.selectAll(".dot").data(scope.data, function(d){return d.key})
            dots.enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .style("fill", function(d) { return color(cValue(d));})
                .on("mouseover", function(d) {
                    scope.$apply(function(){ 
                        d.highlight = true;
                    });
                })
                .on("mouseout", function(d) {
                    scope.$apply(function(){ 
                        d.highlight = false;
                    });
                });
            
            dots.exit().remove();
            
            d3.transition(svg.selectAll(".dot"))
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .style("fill", function(d) { return color(cValue(d));}) 
            
            
            
        })
        
       
    }
}});

