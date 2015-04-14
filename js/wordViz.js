viz.directive("keyword", function($window) {
  return{
    restrict: "EA",
    scope: {
        data: '=',
        totals: '='
    },
    link: function(scope, elem, attrs){
         var width = 200,
                height = 200,
                radius = Math.min(width, height) / 2;
        var color = d3.scale.category20();
        
        
        max = scope.totals.max_doc_count;
        maxbg = scope.totals.max_bg_count;
        max = maxbg;
        minscore = scope.totals.min_score;
        maxscore = scope.totals.max_score;
        
        scope.board = d3.select(elem[0]);
        scope.gliphy = scope.board.append("svg");
        scope.label = scope.board.append("h1").text(scope.data.key);
        
        scope.init = function(){
            scope.createGlyph();
        }
        
        scope.createGlyph = function () {
           var dataset = {
              docs: [max-scope.data.doc_count,scope.data.doc_count],
              docsbg: [maxbg-scope.data.bg_count,scope.data.bg_count]
            };

            var color = ["#fff", "#57D690"];
            var colorbg = ["#fff", "#F2796E"];

            var pie = d3.layout.pie()
                .sort(null);

            var arc = d3.svg.arc()
                .innerRadius(radius - 50)
                .outerRadius(radius - 40);
            
            var arc2 = d3.svg.arc()
                .innerRadius(radius - 50)
                .outerRadius(radius - 60);
            
            var circlecolor = d3.scale.linear()
                .domain([maxscore,minscore])
                .range(["#5A6372", "white"]);

            var svg = scope.gliphy
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.append("circle")
                .attr("fill", function(d) {return circlecolor(scope.data.score)})
                .attr("r", radius/2+10);
            
            var path = svg.selectAll(".arcBg")
                .data(pie(dataset.docs))
              .enter().append("path")
                .attr("class", "arcBg")
                .attr("fill", function(d, i) { return color[i]; })
                .attr("d", arc);
            
            var path = svg.selectAll(".arc")
                .data(pie(dataset.docsbg))
              .enter().append("path")
                .attr("class", "arc")
                .attr("fill", function(d, i) { return colorbg[i]; })
                .attr("d", arc2);
            
            


        }
        
        scope.update = function () {
             scope.gliphy.selectAll("path")
                .data(pie([max-scope.data.doc_count,scope.data.doc_count]))
              .enter().append("path")
                .attr("fill", function(d, i) { return color(i); })
                .attr("d", arc);
        }
        
        scope.init();
    }
  };
});