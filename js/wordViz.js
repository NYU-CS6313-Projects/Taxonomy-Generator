viz.directive("keyword", function($window) {
  return{
    restrict: "EA",
    scope: {
        data: '=',
        totals: '='
    },
    link: function(scope, elem, attrs){
        
        if(!scope.totals || !scope.data)
            return;
        
         var width = 80,
                height = 80,
                radius = Math.min(width, height) / 2;
        var color = d3.scale.category20();
        
        max = scope.totals.max_doc_count;
        maxbg = scope.totals.max_bg_count;
        max = maxbg;
        minscore = scope.totals.min_score;
        maxscore = scope.totals.max_score;
        
        scope.board = d3.select(elem[0]);
        scope.gliphy = scope.board.append("svg")
            .attr("width", width)
            .attr("height", height)
        scope.label = scope.board.append("h1").text(scope.data.key);
        
        scope.init = function(){
            scope.createGlyph();
        }
        
        
        scope.createGlyph_old = function () {
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
        
        
        scope.createVeen = function () {
            var sets = [ 
                {sets: ['word'], size:  scope.data.bg_count}, 
                {sets: ['topic'], size: scope.totals.total},
                {sets: ['word','topic'], size: scope.data.doc_count}];
            
            var chart = venn.VennDiagram() 
                .width(80)
                .height(80)
            var veen = scope.gliphy.append("g")
                .attr("transform", "translate(" + 0 +"," + 0 +")")
                .datum(sets).call(chart)
            scope.gliphy.selectAll(".venn-circle path")
                .style("fill", null);
            
        }
        
        scope.createGlyph = function() {
            var anScore = (scope.data.score * 360)/2;
            
            var scoreArc = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(-1*anScore * (Math.PI/180)) //converting from degs to radians
                .endAngle(anScore * (Math.PI/180)) //just radians
            
            var scoreArcBase = d3.svg.arc()
                .innerRadius(radius-6)
                .outerRadius(radius-2)
                .startAngle(0 * (Math.PI/180)) //converting from degs to radians
                .endAngle(360 * (Math.PI/180)) //just radians

            scope.gliphy.append("path")
                .attr("class", "scoreArcBase")
                .attr("d", scoreArcBase)
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            scope.gliphy.append("path")
                .attr("class", "scoreArc")
                .attr("d", scoreArc)
                .attr("transform", "translate(" + radius +"," + radius +")")
            
            

            scope.createVeen();
        }
        
        //-----------------------------------------
        scope.init();
    }
  };
});



















